import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator'
import { Exclude } from 'class-transformer'

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsEmail()
  @IsNotEmpty()
  email: string

  @Exclude()
  password: string
}
