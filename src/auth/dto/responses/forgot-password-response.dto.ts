import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Password reset code sent to your email',
  })
  message: string;
}