import { IsEmail, IsEnum, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  phone_number: string;

  @IsString()
  address: string;

  @IsEnum({
    JOB_POSTER: 'JOB_POSTER',
    JOB_SEEKER: 'JOB_SEEKER',
  })
  role: 'JOB_POSTER' | 'JOB_SEEKER';

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
