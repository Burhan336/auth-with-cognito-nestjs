export interface AuthTokens {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  name?: string;
  emailVerified: boolean;
}

export interface AuthUser {
  userId: string;
  email: string;
  name?: string;
  emailVerified: boolean;
}

export interface CognitoUserAttributes {
  name?: string;
  email?: string;
  phone_number?: string;
  birthdate?: string;
}

export type TokenType = 'id' | 'access'; 