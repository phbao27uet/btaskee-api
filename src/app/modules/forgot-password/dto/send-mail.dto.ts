import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendMailDto {
  @ApiProperty({
    example: 'zen_1@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;
}
