import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string

  @Exclude()
  @ApiProperty()
  password: string
}
