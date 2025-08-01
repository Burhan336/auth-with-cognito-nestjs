## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# NestJS Authentication with AWS Cognito

A robust NestJS application that implements user authentication using AWS Cognito. This project provides a complete authentication system with user registration, login, email confirmation, and JWT token-based authorization.

## 🚀 Features

- **User Registration**: Sign up with email, password, and name
- **User Authentication**: Sign in with email and password
- **Email Confirmation**: Confirm registration with email verification code
- **JWT Token Validation**: Secure route protection with Cognito JWT verification
- **Swagger API Documentation**: Interactive API documentation at `/api`
- **Input Validation**: Comprehensive request validation using class-validator
- **Error Handling**: Detailed error responses for various authentication scenarios
- **Protected Routes**: Example protected endpoints demonstrating JWT authentication

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x
- **Authentication**: AWS Cognito
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- AWS Account with Cognito User Pool configured
- AWS CLI configured (optional, for deployment)

## 🔧 Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# AWS Configuration
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id
COGNITO_CLIENT_SECRET=your-client-secret
```

### AWS Cognito Setup

1. **Create a User Pool**:
   - Go to AWS Cognito Console
   - Create a new User Pool
   - Configure password requirements
   - Enable email verification

2. **Create an App Client**:
   - In your User Pool, create an App Client
   - Enable `USER_PASSWORD_AUTH` authentication flow
   - Generate a client secret
   - Note down the Client ID and Client Secret

3. **Configure App Client Settings**:
   - Set callback URLs if needed
   - Configure OAuth flows if required

## 🚀 Installation & Running

### Install Dependencies

```bash
npm install
```

### Development

```bash
# Start in development mode with hot reload
npm run start:dev

# Start in debug mode
npm run start:debug
```

### Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

## 📚 API Documentation

Once the application is running, visit `http://localhost:3000/api` to access the interactive Swagger documentation.

### Authentication Endpoints

#### 1. User Registration
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "message": "User created successfully",
  "user": {
    "UserSub": "uuid",
    "UserConfirmed": false
  }
}
```

#### 2. Email Confirmation
```http
POST /auth/confirm-signup
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response**:
```json
{
  "message": "User confirmed successfully"
}
```

#### 3. User Login
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Authentication successful"
}
```

### Protected Endpoints

All protected endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

#### 1. Get Protected Data
```http
GET /protected
Authorization: Bearer <token>
```

#### 2. Get User Profile
```http
GET /user-profile
Authorization: Bearer <token>
```

#### 3. Submit Test Data
```http
POST /test-data
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello from test"
}
```

### Public Endpoints

#### 1. Health Check
```http
GET /
```

#### 2. Public Information
```http
GET /public-info
```

## 🔐 Security Features

- **JWT Token Verification**: All protected routes verify Cognito JWT tokens
- **Secret Hash**: AWS Cognito client secret hash for enhanced security
- **Input Validation**: Comprehensive validation using class-validator
- **Error Handling**: Secure error messages that don't leak sensitive information
- **Rate Limiting**: Built-in AWS Cognito rate limiting protection

## 🏗️ Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts      # Authentication endpoints
│   ├── auth.service.ts         # Cognito integration logic
│   ├── cognito-auth.guard.ts   # JWT verification guard
│   └── dto/                    # Data transfer objects
│       ├── auth-response.dto.ts
│       ├── confirm-signup.dto.ts
│       ├── signin.dto.ts
│       └── signup.dto.ts
├── app.controller.ts           # Main application controller
├── app.service.ts              # Application service
├── app.module.ts               # Root module
└── main.ts                     # Application bootstrap
```

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Test individual components and services
- **E2E Tests**: Test complete API endpoints
- **Coverage Reports**: Generate test coverage reports

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🔧 Configuration

### AWS Cognito Configuration

The application uses the following AWS Cognito features:

- **User Pool**: Manages user accounts and authentication
- **App Client**: Handles authentication flows
- **JWT Tokens**: Secure token-based authentication
- **Email Verification**: Required email confirmation

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_REGION` | AWS region for Cognito | Yes |
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID | Yes |
| `COGNITO_CLIENT_ID` | Cognito App Client ID | Yes |
| `COGNITO_CLIENT_SECRET` | Cognito App Client Secret | Yes |

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### AWS Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to AWS**:
   - Use AWS Elastic Beanstalk
   - Deploy to AWS Lambda with API Gateway
   - Use AWS ECS/Fargate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Invalid JWT Token**: Ensure the token is from the correct Cognito User Pool
2. **User Not Confirmed**: Users must confirm their email before signing in
3. **Invalid Credentials**: Check email and password combination
4. **Rate Limiting**: AWS Cognito has built-in rate limiting

### Debug Mode

Run the application in debug mode for detailed logging:

```bash
npm run start:debug
```

## 📞 Support

For issues and questions:

1. Check the [NestJS documentation](https://docs.nestjs.com/)
2. Review [AWS Cognito documentation](https://docs.aws.amazon.com/cognito/)
3. Open an issue in this repository

---

**Note**: This is a production-ready authentication system. Make sure to follow security best practices when deploying to production environments.
