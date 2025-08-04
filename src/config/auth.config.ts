export const authConfig = () => ({
  auth: {
    provider: process.env.AUTH_PROVIDER || 'cognito',
    cognito: {
      region: process.env.AWS_REGION,
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
    },
    jwt: {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
  },
}); 