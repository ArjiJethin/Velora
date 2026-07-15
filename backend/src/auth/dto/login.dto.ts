import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'ada@velora.app' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Str0ng!Password123' })
  @IsString()
  @MinLength(1)
  password!: string;
}