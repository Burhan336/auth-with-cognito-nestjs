export const AUTH_CONSTANTS = {
  TOKEN_EXPIRY: 3600, // 1 hour
  PASSWORD_MIN_LENGTH: 8,
  CONFIRMATION_CODE_LENGTH: 6,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900, // 15 minutes
} as const;

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Incorrect email or password',
  USER_NOT_FOUND: 'User not found',
  USER_NOT_CONFIRMED: 'Please confirm your email before signing in',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token has expired',
  ACCESS_DENIED: 'Access denied',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
} as const;

export const AUTH_SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_CONFIRMED: 'User confirmed successfully',
  AUTHENTICATION_SUCCESS: 'Authentication successful',
  PASSWORD_RESET_SENT: 'Password reset code sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password successfully reset',
  PASSWORD_CHANGED: 'Password successfully changed',
  PROFILE_UPDATED: 'Profile successfully updated',
  PROFILE_RETRIEVED: 'Profile retrieved successfully',
  CONFIRMATION_RESENT: 'Confirmation code resent to your email',
} as const; 