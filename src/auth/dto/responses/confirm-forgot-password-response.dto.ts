import { ApiProperty } from '@nestjs/swagger';

export class ConfirmForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Password successfully reset',
  })
  message: string;
} 