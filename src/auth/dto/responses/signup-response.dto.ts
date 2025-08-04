import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'User details',
    example: {
      UserSub: '12345678-1234-1234-1234-123456789012',
      UserConfirmed: false,
      CodeDeliveryDetails: {
        Destination: 'u***@e***',
        DeliveryMedium: 'EMAIL',
        AttributeName: 'email'
      }
    },
  })
  user: any;
}
