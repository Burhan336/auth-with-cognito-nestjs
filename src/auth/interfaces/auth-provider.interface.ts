export interface IAuthProvider {
  signUp(email: string, password: string, attributes?: Record<string, any>): Promise<any>;
  signIn(email: string, password: string): Promise<any>;
  confirmSignUp(email: string, code: string): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  confirmForgotPassword(email: string, code: string, newPassword: string): Promise<any>;
  resendConfirmationCode(email: string): Promise<any>;
  changePassword(accessToken: string, currentPassword: string, newPassword: string): Promise<any>;
  updateProfile(accessToken: string, attributes: Record<string, any>): Promise<any>;
  getUserProfile(accessToken: string): Promise<any>;
  verifyToken(token: string, tokenType?: 'id' | 'access'): Promise<any>;
} 