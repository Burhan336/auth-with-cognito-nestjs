import { ApiProperty } from '@nestjs/swagger';

export class GetProfileResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Profile retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'User profile details',
    example: {
      Username: 'user@example.com',
      UserAttributes: [
        { Name: 'sub', Value: '12345678-1234-1234-1234-123456789012' },
        { Name: 'email', Value: 'user@example.com' },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: 'John Doe' }
      ]
    },
  })
  user: any;
} 