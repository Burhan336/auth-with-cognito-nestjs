import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ConfirmSignUpDto } from './dto/confirm-signup.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already exists',
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const result = await this.authService.signUp(
      signUpDto.email, 
      signUpDto.password,
      signUpDto.name
    );
    return {
      message: 'User created successfully',
      user: result,
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and get JWT token' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    const token = await this.authService.signIn(signInDto.email, signInDto.password);
    return {
      token,
      message: 'Authentication successful',
    };
  }

  @Post('confirm-signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm user registration with email code' })
  @ApiBody({ type: ConfirmSignUpDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully confirmed',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid confirmation code',
  })
  async confirmSignUp(@Body() confirmSignUpDto: ConfirmSignUpDto): Promise<AuthResponseDto> {
    await this.authService.confirmSignUp(confirmSignUpDto.email, confirmSignUpDto.code);
    return {
      message: 'User confirmed successfully',
    };
  }
}
