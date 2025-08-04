import { AUTH_CONSTANTS } from '../constants/auth.constants';

export class AuthUtils {
  static validatePassword(password: string): boolean {
    return password.length >= AUTH_CONSTANTS.PASSWORD_MIN_LENGTH;
  }

  static validateConfirmationCode(code: string): boolean {
    return code.length === AUTH_CONSTANTS.CONFIRMATION_CODE_LENGTH && /^\d+$/.test(code);
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    const maskedDomain = domain.charAt(0) + '*'.repeat(domain.length - 2) + domain.charAt(domain.length - 1);
    return `${maskedLocal}@${maskedDomain}`;
  }
} 