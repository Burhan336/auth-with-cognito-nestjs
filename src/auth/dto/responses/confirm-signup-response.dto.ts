import { ApiProperty } from '@nestjs/swagger';

export class ConfirmSignUpResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User confirmed successfully',
  })
  message: string;
} 