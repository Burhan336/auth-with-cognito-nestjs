import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CognitoAuthGuard {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No valid authorization header');
    }

    const token = authHeader.substring(7);

    try {
      let payload;
      let tokenType = 'id';
      
      // Try ID token first
      try {
        payload = await this.authService.verifyToken(token, 'id');
      } catch (idTokenError) {
        // If ID token fails, try access token
        try {
          payload = await this.authService.verifyToken(token, 'access');
          tokenType = 'access';
        } catch (accessTokenError) {
          throw new UnauthorizedException('Invalid token');
        }
      }
      
      // Attach user info to request
      request.user = {
        userId: payload.sub,
        email: payload.email || payload.username,
        name: payload.name,
        emailVerified: payload.email_verified
      };

      // Store the original token
      request.accessToken = token;
      request.tokenType = tokenType;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 