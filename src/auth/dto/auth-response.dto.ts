import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token?: string;

  @ApiProperty({
    description: 'Success message',
    example: 'User created successfully',
  })
  message?: string;

  @ApiProperty({
    description: 'User details',
    example: { userId: '123', email: 'user@example.com' },
  })
  user?: any;
} 