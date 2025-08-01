import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CognitoAuthGuard {
  private verifier: any;

  constructor() {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      tokenUse: 'id',
      clientId: process.env.COGNITO_CLIENT_ID!,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No valid authorization header');
    }

    const token = authHeader.substring(7);

    try {
      const payload = await this.verifier.verify(token);
      
      // Attach user info to request
      request.user = {
        userId: payload.sub,
        email: payload.email,
        name: payload.name,
        emailVerified: payload.email_verified
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 