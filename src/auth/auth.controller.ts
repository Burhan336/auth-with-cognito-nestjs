import { Controller, Post, Body, HttpCode, HttpStatus, Get, Put, UseGuards, Request, Logger, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/requests/signup.dto'; 
import { SignInDto } from './dto/requests/signin.dto';
import { ConfirmSignUpDto } from './dto/requests/confirm-signup.dto';
import { ForgotPasswordDto } from './dto/requests/forgot-password.dto';
import { ConfirmForgotPasswordDto } from './dto/requests/confirm-forgot-password.dto';
import { ResendConfirmationDto } from './dto/requests/resend-confirmation.dto';
import { ChangePasswordDto } from './dto/requests/change-password.dto';
import { UpdateProfileDto } from './dto/requests/update-profile.dto';
import { CognitoAuthGuard } from './guards/cognito-auth.guard';

// Import separate response DTOs
import { SignUpResponseDto } from './dto/responses/signup-response.dto';
import { SignInResponseDto } from './dto/responses/signin-response.dto';
import { ConfirmSignUpResponseDto } from './dto/responses/confirm-signup-response.dto';
import { ForgotPasswordResponseDto } from './dto/responses/forgot-password-response.dto';
import { ConfirmForgotPasswordResponseDto } from './dto/responses/confirm-forgot-password-response.dto';
import { ResendConfirmationResponseDto } from './dto/responses/resend-confirmation-response.dto';
import { ChangePasswordResponseDto } from './dto/responses/change-password-response.dto';
import { UpdateProfileResponseDto } from './dto/responses/update-profile-response.dto';
import { GetProfileResponseDto } from './dto/responses/get-profile-response.dto';

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
    type: SignUpResponseDto,
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
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
    type: SignInResponseDto,
  })
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    const tokens = await this.authService.signIn(signInDto.email, signInDto.password);
    return {
      token: tokens.idToken || '',
      accessToken: tokens.accessToken || '',
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
    type: ConfirmSignUpResponseDto,
  })
  async confirmSignUp(@Body() confirmSignUpDto: ConfirmSignUpDto): Promise<ConfirmSignUpResponseDto> {
    await this.authService.confirmSignUp(confirmSignUpDto.email, confirmSignUpDto.code);
    return {
      message: 'User confirmed successfully',
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset code sent to email',
    type: ForgotPasswordResponseDto,
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return {
      message: 'Password reset code sent to your email',
    };
  }

  @Post('confirm-forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm password reset with code' })
  @ApiBody({ type: ConfirmForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset',
    type: ConfirmForgotPasswordResponseDto,
  })
  async confirmForgotPassword(@Body() confirmForgotPasswordDto: ConfirmForgotPasswordDto): Promise<ConfirmForgotPasswordResponseDto> {
    await this.authService.confirmForgotPassword(
      confirmForgotPasswordDto.email,
      confirmForgotPasswordDto.code,
      confirmForgotPasswordDto.newPassword
    );
    return {
      message: 'Password successfully reset',
    };
  }

  @Post('resend-confirmation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email confirmation code' })
  @ApiBody({ type: ResendConfirmationDto })
  @ApiResponse({
    status: 200,
    description: 'Confirmation code resent',
    type: ResendConfirmationResponseDto,
  })
  async resendConfirmation(@Body() resendConfirmationDto: ResendConfirmationDto): Promise<ResendConfirmationResponseDto> {
    await this.authService.resendConfirmationCode(resendConfirmationDto.email);
    return {
      message: 'Confirmation code resent to your email',
    };
  }

  @Post('change-password')
  @UseGuards(CognitoAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password (authenticated user)' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password successfully changed',
    type: ChangePasswordResponseDto,
  })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req): Promise<ChangePasswordResponseDto> {
    if (!req.accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    await this.authService.changePassword(
      req.accessToken,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword
    );

    return {
      message: 'Password successfully changed',
    };
  }

  @Put('profile')
  @UseGuards(CognitoAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile successfully updated',
    type: UpdateProfileResponseDto,
  })
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Request() req): Promise<UpdateProfileResponseDto> {
    if (!req.accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    const attributes = Object.fromEntries(
      Object.entries(updateProfileDto).filter(([_, value]) => value !== undefined)
    );

    const result = await this.authService.updateProfile(req.accessToken, attributes);
    
    return {
      message: 'Profile successfully updated',
      user: result,
    };
  }

  @Get('profile')
  @UseGuards(CognitoAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    type: GetProfileResponseDto,
  })
  async getProfile(@Request() req): Promise<GetProfileResponseDto> {
    if (!req.accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    const profile = await this.authService.getUserProfile(req.accessToken);
    return {
      message: 'Profile retrieved successfully',
      user: profile,
    };
  }
}
