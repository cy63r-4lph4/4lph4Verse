import { relations } from 'drizzle-orm';
import { users } from './core/users';
import { arenaUser } from './arena_users';
import { arenaSchools } from './arena_universities';
import { arenaCourses } from './arena_courses';
import { arenaUserCourses } from './arena_user_courses';
import { showdownAnswers } from 'src/db/schema/showdown_answers';
import { arenaQuestions } from 'src/db/schema/arena_questions';
import { showdownMatchQuestions } from 'src/db/schema/showdown_match_questions';
import { showdownParticipants } from 'src/db/schema/showdown_participants';
import { showdownMatches } from 'src/db/schema/showdown_matches';
import { showdowns } from 'src/db/schema/showdowns';
import { feedReactions } from 'src/db/schema/feed_reactions';
import { feedPosts } from 'src/db/schema/feed_posts';
import { feedComments } from 'src/db/schema/feed_comments';
import { forgeSubmissions } from 'src/db/schema/forge_submissions';

// --- 1. CORE USER RELATIONS ---
export const usersRelations = relations(users, ({ one }) => ({
    arenaUser: one(arenaUser, {
        fields: [users.id],
        references: [arenaUser.userId],
    }),
}));

// --- 2. ARENA USER (FIGHTER) RELATIONS ---
export const arenaUserRelations = relations(arenaUser, ({ one, many }) => ({
    user: one(users, {
        fields: [arenaUser.userId],
        references: [users.id],
    }),
    school: one(arenaSchools, {
        fields: [arenaUser.schoolId],
        references: [arenaSchools.id],
    }),
    // Link to the junction table
    userCourses: many(arenaUserCourses),
}));

// --- 3. ARENA SCHOOL (HUB) RELATIONS ---
export const arenaSchoolRelations = relations(arenaSchools, ({ many }) => ({
    students: many(arenaUser),
    sectors: many(arenaCourses),
}));

// --- 4. ARENA COURSE (SECTOR) RELATIONS ---
export const arenaCoursesRelations = relations(arenaCourses, ({ one, many }) => ({
    school: one(arenaSchools, {
        fields: [arenaCourses.schoolId],
        references: [arenaSchools.id],
    }),
    // Link to the junction table (This is where our fighter count comes from)
    courseUsers: many(arenaUserCourses),
}));

// --- 5. JUNCTION TABLE RELATIONS (The Bridge) ---
export const arenaUserCoursesRelations = relations(arenaUserCourses, ({ one }) => ({
    user: one(arenaUser, {
        fields: [arenaUserCourses.userId],
        references: [arenaUser.id],
    }),
    course: one(arenaCourses, {
        fields: [arenaUserCourses.courseId],
        references: [arenaCourses.id],
    }),
}));

export const showdownsRelations = relations(showdowns, ({ one, many }) => ({
  course: one(arenaCourses, {
    fields: [showdowns.courseId],
    references: [arenaCourses.id],
  }),
  creator: one(arenaUser, {
    fields: [showdowns.createdBy],
    references: [arenaUser.id],
  }),
  participants: many(showdownParticipants),
  matches: many(showdownMatches),
}));

export const showdownParticipantsRelations = relations(
  showdownParticipants,
  ({ one }) => ({
    showdown: one(showdowns, {
      fields: [showdownParticipants.showdownId],
      references: [showdowns.id],
    }),
    arenaUser: one(arenaUser, {
      fields: [showdownParticipants.arenaUserId],
      references: [arenaUser.id],
    }),
  }),
);

export const showdownMatchesRelations = relations(
  showdownMatches,
  ({ one, many }) => ({
    showdown: one(showdowns, {
      fields: [showdownMatches.showdownId],
      references: [showdowns.id],
    }),
    playerA: one(showdownParticipants, {
      fields: [showdownMatches.playerAId],
      references: [showdownParticipants.id],
    }),
    playerB: one(showdownParticipants, {
      fields: [showdownMatches.playerBId],
      references: [showdownParticipants.id],
    }),
    questions: many(showdownMatchQuestions),
  }),
);

export const showdownMatchQuestionsRelations = relations(
  showdownMatchQuestions,
  ({ one, many }) => ({
    match: one(showdownMatches, {
      fields: [showdownMatchQuestions.matchId],
      references: [showdownMatches.id],
    }),
    question: one(arenaQuestions, {
      fields: [showdownMatchQuestions.questionId],
      references: [arenaQuestions.id],
    }),
    answers: many(showdownAnswers),
  }),
);

export const showdownAnswersRelations = relations(
  showdownAnswers,
  ({ one }) => ({
    matchQuestion: one(showdownMatchQuestions, {
      fields: [showdownAnswers.matchQuestionId],
      references: [showdownMatchQuestions.id],
    }),
    participant: one(showdownParticipants, {
      fields: [showdownAnswers.participantId],
      references: [showdownParticipants.id],
    }),
  }),
);

export const feedPostsRelations = relations(feedPosts, ({ one, many }) => ({
  course: one(arenaCourses, {
    fields: [feedPosts.courseId],
    references: [arenaCourses.id],
  }),
  author: one(arenaUser, {
    fields: [feedPosts.authorArenaUserId],
    references: [arenaUser.id],
  }),
  comments: many(feedComments),
  reactions: many(feedReactions),
}));

export const feedCommentsRelations = relations(feedComments, ({ one }) => ({
  post: one(feedPosts, {
    fields: [feedComments.postId],
    references: [feedPosts.id],
  }),
  author: one(arenaUser, {
    fields: [feedComments.authorArenaUserId],
    references: [arenaUser.id],
  }),
}));

export const feedReactionsRelations = relations(feedReactions, ({ one }) => ({
  post: one(feedPosts, {
    fields: [feedReactions.postId],
    references: [feedPosts.id],
  }),
  arenaUser: one(arenaUser, {
    fields: [feedReactions.arenaUserId],
    references: [arenaUser.id],
  }),
}));

export const forgeSubmissionsRelations = relations(forgeSubmissions, ({ one }) => ({
  course: one(arenaCourses, {
    fields: [forgeSubmissions.courseId],
    references: [arenaCourses.id],
  }),
  submittedBy: one(arenaUser, {
    fields: [forgeSubmissions.submittedByArenaUserId],
    references: [arenaUser.id],
    relationName: "forge_submitter",
  }),
  reviewedBy: one(arenaUser, {
    fields: [forgeSubmissions.reviewedByArenaUserId],
    references: [arenaUser.id],
    relationName: "forge_reviewer",
  }),
  approvedQuestion: one(arenaQuestions, {
    fields: [forgeSubmissions.approvedQuestionId],
    references: [arenaQuestions.id],
  }),
}));