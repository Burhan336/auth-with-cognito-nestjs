import { ApiProperty } from '@nestjs/swagger';

export class ResendConfirmationResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Confirmation code resent to your email',
  })
  message: string;
} 