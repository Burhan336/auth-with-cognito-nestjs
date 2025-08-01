import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  private cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

  private calculateSecretHash(username: string): string {
    const message = username + process.env.COGNITO_CLIENT_ID!;
    const hmac = crypto.createHmac('SHA256', process.env.COGNITO_CLIENT_SECRET!);
    hmac.update(message);
    return hmac.digest('base64');
  }

  async signUp(email: string, password: string, name: string): Promise<any> {
    try {
      const command = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        SecretHash: this.calculateSecretHash(email),
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
          {
            Name: 'name',
            Value: name,
          },
        ],
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        throw new BadRequestException('User already exists with this email');
      }
      if (error.name === 'InvalidPasswordException') {
        throw new BadRequestException('Password does not meet requirements');
      }
      if (error.name === 'InvalidParameterException') {
        throw new BadRequestException('Invalid input parameters');
      }
      throw new BadRequestException(error.message || 'Signup failed');
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
      return result.AuthenticationResult?.IdToken;
    } catch (error) {
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException('Incorrect email or password');
      }
      if (error.name === 'UserNotConfirmedException') {
        throw new BadRequestException('Please confirm your email before signing in');
      }
      if (error.name === 'UserNotFoundException') {
        throw new UnauthorizedException('User not found');
      }
      if (error.name === 'TooManyRequestsException') {
        throw new BadRequestException('Too many failed attempts. Please try again later');
      }
      throw new UnauthorizedException('Authentication failed');
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
      if (error.name === 'CodeMismatchException') {
        throw new BadRequestException('Invalid confirmation code');
      }
      if (error.name === 'ExpiredCodeException') {
        throw new BadRequestException('Confirmation code has expired');
      }
      if (error.name === 'UserNotFoundException') {
        throw new BadRequestException('User not found');
      }
      throw new BadRequestException('Confirmation failed');
    }
  }
}
