import { Controller, Get, UseGuards, Post, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiProperty } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CognitoAuthGuard } from './auth/guards/cognito-auth.guard';

// DTO for test endpoint
class TestDataDto {
  @ApiProperty({ description: 'Test message', example: 'Hello from test' })
  message: string;
}

@ApiTags('Auth Server')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get server status' })
  @ApiResponse({ status: 200, description: 'Server is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  @UseGuards(CognitoAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get protected resource' })
  @ApiResponse({ status: 200, description: 'Protected resource' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProtectedData() {
    return { message: 'This is a protected route', timestamp: new Date() };
  }

  @Get('user-profile')
  @UseGuards(CognitoAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserProfile(@Request() req) {
    return {
      message: 'User profile retrieved successfully',
      user: req.user,
      timestamp: new Date()
    };
  }

  @Post('test-data')
  @UseGuards(CognitoAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit test data (protected)' })
  @ApiBody({ type: TestDataDto })
  @ApiResponse({ status: 201, description: 'Test data submitted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  submitTestData(@Body() testData: TestDataDto, @Request() req) {
    return {
      message: 'Test data received successfully',
      submittedData: testData,
      submittedBy: req.user,
      timestamp: new Date()
    };
  }

  @Get('public-info')
  @ApiOperation({ summary: 'Get public information (no auth required)' })
  @ApiResponse({ status: 200, description: 'Public information' })
  getPublicInfo() {
    return {
      message: 'This is public information',
      apiVersion: '1.0.0',
      timestamp: new Date()
    };
  }
}
