import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Password successfully changed',
  })
  message: string;
} 