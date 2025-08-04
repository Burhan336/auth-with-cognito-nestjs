import { Injectable } from '@nestjs/common';
import { AuthServiceFactory, AuthProviderType } from './services/auth.service.factory';
import { IAuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  private authProvider: any;

  constructor(private authServiceFactory: AuthServiceFactory) {
    // Default to Cognito, but can be configured via environment variable
    const providerType = (process.env.AUTH_PROVIDER as AuthProviderType) || AuthProviderType.COGNITO;
    this.authProvider = this.authServiceFactory.getProvider(providerType);
  }

  async signUp(email: string, password: string, name: string): Promise<any> {
    return await this.authProvider.signUp(email, password, { name });
  }

  async signIn(email: string, password: string): Promise<IAuthResponse> {
    return await this.authProvider.signIn(email, password);
  }

  async confirmSignUp(email: string, code: string): Promise<any> {
    return await this.authProvider.confirmSignUp(email, code);
  }

  async forgotPassword(email: string): Promise<any> {
    return await this.authProvider.forgotPassword(email);
  }

  async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<any> {
    return await this.authProvider.confirmForgotPassword(email, code, newPassword);
  }

  async resendConfirmationCode(email: string): Promise<any> {
    return await this.authProvider.resendConfirmationCode(email);
  }

  async changePassword(accessToken: string, currentPassword: string, newPassword: string): Promise<any> {
    return await this.authProvider.changePassword(accessToken, currentPassword, newPassword);
  }

  async updateProfile(accessToken: string, attributes: Record<string, any>): Promise<any> {
    return await this.authProvider.updateProfile(accessToken, attributes);
  }

  async getUserProfile(accessToken: string): Promise<any> {
    return await this.authProvider.getUserProfile(accessToken);
  }

  async verifyToken(token: string, tokenType?: 'id' | 'access'): Promise<any> {
    return await this.authProvider.verifyToken(token, tokenType);
  }
}
