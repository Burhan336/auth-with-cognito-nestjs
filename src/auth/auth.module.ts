import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceFactory } from './services/auth.service.factory';
import { CognitoAuthProvider } from './providers/cognito/cognito-auth.provider';
import { CognitoAuthGuard } from './guards/cognito-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthServiceFactory,
    CognitoAuthProvider,
    CognitoAuthGuard,
  ],
  exports: [AuthService, CognitoAuthGuard],
})
export class AuthModule {} 