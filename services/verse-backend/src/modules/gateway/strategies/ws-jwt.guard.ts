import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export function extractSocketToken(client: Socket): string | null {
  const fromAuth = client.handshake.auth?.token;
  if (typeof fromAuth === 'string' && fromAuth.length > 0) return fromAuth;

  const header = client.handshake.headers?.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return null;
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = extractSocketToken(client);
    if (!token) throw new UnauthorizedException('Missing token');

    try {
      const payload = this.jwtService.verify(token);
      // Mirrors what your JwtAuthGuard attaches on req.user
      (client.data as any).user = { id: payload.sub, username: payload.username };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}