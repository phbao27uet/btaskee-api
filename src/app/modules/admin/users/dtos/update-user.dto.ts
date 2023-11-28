import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { USER_STATUS } from 'src/utils/constants';

export class UpdateUserDto {
  @ApiProperty({
    example: USER_STATUS['APPROVED'],
  })
  @IsString()
  status: keyof typeof USER_STATUS;
}
