import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand,
  ForgotPasswordCommand, ConfirmForgotPasswordCommand, ResendConfirmationCodeCommand,
  ChangePasswordCommand, UpdateUserAttributesCommand, GetUserCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { IAuthProvider } from '../../interfaces/auth-provider.interface';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CognitoAuthProvider implements IAuthProvider {
  private cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
  private idTokenVerifier: any;
  private accessTokenVerifier: any;

  constructor() {
    this.idTokenVerifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      tokenUse: 'id',
      clientId: process.env.COGNITO_CLIENT_ID!,
    });

    this.accessTokenVerifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      tokenUse: 'access',
      clientId: process.env.COGNITO_CLIENT_ID!,
    });
  }

  private calculateSecretHash(username: string): string {
    const message = username + process.env.COGNITO_CLIENT_ID!;
    const hmac = crypto.createHmac('SHA256', process.env.COGNITO_CLIENT_SECRET!);
    hmac.update(message);
    return hmac.digest('base64');
  }

  async signUp(email: string, password: string, attributes?: Record<string, any>): Promise<any> {
    try {
      const userAttributes = [
        { Name: 'email', Value: email },
        ...(attributes?.name ? [{ Name: 'name', Value: attributes.name }] : []),
        ...Object.entries(attributes || {}).map(([key, value]) => ({ Name: key, Value: value as string }))
      ];

      const command = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        SecretHash: this.calculateSecretHash(email),
        UserAttributes: userAttributes,
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      this.handleCognitoError(error);
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    try {
      const command = new InitiateAuthCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: this.calculateSecretHash(email),
        },
      });

      const result = await this.cognitoClient.send(command);
      return {
        idToken: result.AuthenticationResult?.IdToken,
        accessToken: result.AuthenticationResult?.AccessToken,
        refreshToken: result.AuthenticationResult?.RefreshToken,
      };
    } catch (error) {
      this.handleCognitoError(error);
    }
  }

  async confirmSignUp(email: string, code: string): Promise<any> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        SecretHash: this.calculateSecretHash(email),
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      this.handleCognitoError(error);
    }
  }

  async forgotPassword(email: string): Promise<any> {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        SecretHash: this.calculateSecretHash(email),
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      this.handleCognitoError(error);
    }
  }

  async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<any> {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
        SecretHash: this.calculateSecretHash(email),
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      this.handleCognitoError(error);
    }
  }

  async resendConfirmationCode(email: string): Promise<any> {
    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        SecretHash: this.calculateSecretHash(email),
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      this.handleCognitoError(error);
    }
  }

  async changePassword(accessToken: string, currentPassword: string, newPassword: string): Promise<any> {
    try {
      const command = new ChangePasswordCommand({
        AccessToken: accessToken,
        PreviousPassword: currentPassword,
        ProposedPassword: newPassword,
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      this.handleCognitoError(error);
    }
  }

  async updateProfile(accessToken: string, attributes: Record<string, any>): Promise<any> {
    try {
      const userAttributes = Object.entries(attributes).map(([key, value]) => ({
        Name: key,
        Value: value as string,
      }));

      const command = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: userAttributes,
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      this.handleCognitoError(error);
    }
  }

  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const command = new GetUserCommand({
        AccessToken: accessToken,
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      this.handleCognitoError(error);
    }
  }

  async verifyToken(token: string, tokenType: 'id' | 'access' = 'id'): Promise<any> {
    try {
      const verifier = tokenType === 'id' ? this.idTokenVerifier : this.accessTokenVerifier;
      return await verifier.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private handleCognitoError(error: any): never {
    const errorMap: Record<string, { exception: any; message: string }> = {
      UsernameExistsException: { exception: BadRequestException, message: 'User already exists with this email' },
      InvalidPasswordException: { exception: BadRequestException, message: 'Password does not meet requirements' },
      InvalidParameterException: { exception: BadRequestException, message: 'Invalid input parameters' },
      NotAuthorizedException: { exception: UnauthorizedException, message: 'Incorrect email or password' },
      UserNotConfirmedException: { exception: BadRequestException, message: 'Please confirm your email before signing in' },
      UserNotFoundException: { exception: UnauthorizedException, message: 'User not found' },
      TooManyRequestsException: { exception: BadRequestException, message: 'Too many failed attempts. Please try again later' },
      CodeMismatchException: { exception: BadRequestException, message: 'Invalid confirmation code' },
      ExpiredCodeException: { exception: BadRequestException, message: 'Confirmation code has expired' },
      LimitExceededException: { exception: BadRequestException, message: 'Too many requests. Please try again later' },
      PasswordHistoryPolicyViolationException: { exception: BadRequestException, message: 'New password matches a previous password' },
      PasswordResetRequiredException: { exception: BadRequestException, message: 'Password reset is required' },
      AliasExistsException: { exception: BadRequestException, message: 'Email or phone number already exists' },
      CodeDeliveryFailureException: { exception: BadRequestException, message: 'Failed to deliver verification code' },
    };

    const errorInfo = errorMap[error.name];
    if (errorInfo) {
      throw new errorInfo.exception(errorInfo.message);
    }

    throw new BadRequestException(error.message || 'Operation failed');
  }
} 