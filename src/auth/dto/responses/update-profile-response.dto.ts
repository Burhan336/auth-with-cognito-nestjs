import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Profile successfully updated',
  })
  message: string;

  @ApiProperty({
    description: 'Updated user details',
    example: {
      CodeDeliveryDetailsList: [
        {
          AttributeName: 'email',
          DeliveryMedium: 'EMAIL',
          Destination: 'u***@e***'
        }
      ]
    },
  })
  user?: any;
}