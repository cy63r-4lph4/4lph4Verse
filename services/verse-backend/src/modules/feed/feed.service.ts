import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { ShowdownService } from '../showdown/showdown.service';
import { ArenaIdentityService } from '../arena/arena-identity.service';

@Injectable()
export class FeedService {
  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
    private readonly showdownService: ShowdownService,
    private readonly identity: ArenaIdentityService,
  ) {}

  // ── Posts ────────────────────────────────────────────────────────────

  async createPost(authorArenaUserId: string, dto: {
    courseId: string; type: 'thought' | 'question' | 'announcement';
    content: string; pinned?: boolean;
  }) {
    let pinned = false;

    if (dto.type === 'announcement') {
      const author = await this.getArenaUserOrThrow(authorArenaUserId);
      if (author.role !== 'instructor' && author.role !== 'admin') {
        throw new ForbiddenException('Only instructors or admins can post announcements.');
      }
      pinned = !!dto.pinned;
    }

    const [post] = await this.db.insert(schema.feedPosts).values({
      courseId: dto.courseId,
      authorArenaUserId,
      type: dto.type,
      content: dto.content,
      pinned,
    }).returning();

    return this.hydratePost(post.id, authorArenaUserId);
  }

  async deletePost(postId: string, requesterArenaUserId: string) {
    const post = await this.getPostOrThrow(postId);
    if (post.authorArenaUserId !== requesterArenaUserId) {
      const requester = await this.getArenaUserOrThrow(requesterArenaUserId);
      if (requester.role !== 'admin' && requester.role !== 'instructor') {
        throw new ForbiddenException('Only the author, an instructor, or an admin can delete this post.');
      }
    }
    await this.db.delete(schema.feedPosts).where(eq(schema.feedPosts.id, postId));
  }

  async setPinned(postId: string, requesterArenaUserId: string, pinned: boolean) {
    const post = await this.getPostOrThrow(postId);
    if (post.type !== 'announcement') {
      throw new BadRequestException('Only announcements can be pinned.');
    }
    const requester = await this.getArenaUserOrThrow(requesterArenaUserId);
    if (requester.role !== 'instructor' && requester.role !== 'admin') {
      throw new ForbiddenException('Only instructors or admins can pin announcements.');
    }

    const [updated] = await this.db.update(schema.feedPosts)
      .set({ pinned })
      .where(eq(schema.feedPosts.id, postId))
      .returning();
    return updated;
  }

  // ── Comments ─────────────────────────────────────────────────────────

  async addComment(postId: string, authorArenaUserId: string, content: string) {
    await this.getPostOrThrow(postId); // 404s if the post doesn't exist
    const [comment] = await this.db.insert(schema.feedComments).values({
      postId,
      authorArenaUserId,
      content,
    }).returning();
    return comment;
  }

  async listComments(postId: string) {
    return this.db.query.feedComments.findMany({
      where: (c, { eq }) => eq(c.postId, postId),
      orderBy: (c, { asc }) => [asc(c.createdAt)],
      with: { author: { with: { user: true } } },
    });
  }

  // ── Reactions ────────────────────────────────────────────────────────

  /** Toggle: inserting the same (post, user, type) again removes it. */
  async toggleReaction(postId: string, arenaUserId: string, type: string) {
    await this.getPostOrThrow(postId);

    const existing = await this.db.query.feedReactions.findFirst({
      where: (r, { eq, and }) => and(
        eq(r.postId, postId),
        eq(r.arenaUserId, arenaUserId),
        eq(r.type, type),
      ),
    });

    if (existing) {
      await this.db.delete(schema.feedReactions).where(eq(schema.feedReactions.id, existing.id));
      return { active: false };
    }

    await this.db.insert(schema.feedReactions).values({ postId, arenaUserId, type });
    return { active: true };
  }

  // ── Unified course feed (posts + showdown activity) ─────────────────

  async getFeed(courseId: string, viewerArenaUserId: string) {
    const posts = await this.db.query.feedPosts.findMany({
      where: (p, { eq }) => eq(p.courseId, courseId),
      orderBy: [desc(schema.feedPosts.pinned), desc(schema.feedPosts.createdAt)],
      limit: 30,
      with: {
        author: { with: { user: true } },
        comments: { with: { author: { with: { user: true } } }, orderBy: (c, { asc }) => [asc(c.createdAt)] },
        reactions: true,
      },
    });

    const postItems = posts.map((p) => ({
      id: p.id,
      kind: 'post' as const,
      postType: p.type,
      pinned: p.pinned,
      content: p.content,
      author: { name: p.author.user.username, arenaUserId: p.authorArenaUserId },
      createdAt: p.createdAt,
      reactionCounts: this.tallyReactions(p.reactions),
      viewerReactions: p.reactions.filter((r) => r.arenaUserId === viewerArenaUserId).map((r) => r.type),
      commentCount: p.comments.length,
      comments: p.comments.slice(-3).map((c) => ({
        id: c.id,
        author: c.author.user.username,
        content: c.content,
        createdAt: c.createdAt,
      })),
    }));

    const { battles, challenges } = await this.showdownService.getFeed(courseId, viewerArenaUserId);

    const battleItems = battles.map((b) => ({ ...b, kind: 'battle' as const }));
    const challengeItems = challenges.map((c) => ({ ...c, kind: 'challenge' as const }));

    return [...postItems, ...battleItems, ...challengeItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────

  private tallyReactions(reactions: { type: string }[]) {
    return reactions.reduce<Record<string, number>>((acc, r) => {
      acc[r.type] = (acc[r.type] ?? 0) + 1;
      return acc;
    }, {});
  }

  private async hydratePost(postId: string, viewerArenaUserId: string) {
    const post = await this.db.query.feedPosts.findFirst({
      where: (p, { eq }) => eq(p.id, postId),
      with: { author: { with: { user: true } }, comments: true, reactions: true },
    });
    if (!post) throw new NotFoundException('Post not found.');
    return {
      id: post.id,
      kind: 'post' as const,
      postType: post.type,
      pinned: post.pinned,
      content: post.content,
      author: { name: post.author.user.username, arenaUserId: post.authorArenaUserId },
      createdAt: post.createdAt,
      reactionCounts: this.tallyReactions(post.reactions),
      viewerReactions: post.reactions.filter((r) => r.arenaUserId === viewerArenaUserId).map((r) => r.type),
      commentCount: post.comments.length,
      comments: [],
    };
  }

  private async getPostOrThrow(postId: string) {
    const post = await this.db.query.feedPosts.findFirst({
      where: (p, { eq }) => eq(p.id, postId),
    });
    if (!post) throw new NotFoundException('Post not found.');
    return post;
  }

  private async getArenaUserOrThrow(arenaUserId: string) {
    const user = await this.db.query.arenaUser.findFirst({
      where: (u, { eq }) => eq(u.id, arenaUserId),
    });
    if (!user) throw new NotFoundException('Arena user not found.');
    return user;
  }
}