import { Injectable } from '@nestjs/common';
import { IAuthProvider } from '../interfaces/auth-provider.interface';
import { CognitoAuthProvider } from '../providers/cognito/cognito-auth.provider';

export enum AuthProviderType {
  COGNITO = 'cognito',
  SUPABASE = 'supabase',
  FIREBASE = 'firebase',
  KONG = 'kong',
}

@Injectable()
export class AuthServiceFactory {
  private providers: Map<AuthProviderType, IAuthProvider> = new Map();

  constructor(private cognitoProvider: CognitoAuthProvider) {
    this.providers.set(AuthProviderType.COGNITO, cognitoProvider);
  }

  getProvider(type: AuthProviderType): IAuthProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(`Auth provider ${type} not implemented`);
    }
    return provider;
  }

  registerProvider(type: AuthProviderType, provider: IAuthProvider): void {
    this.providers.set(type, provider);
  }
} 