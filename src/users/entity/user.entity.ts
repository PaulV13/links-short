import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class User {
  @ApiProperty()
  id: number
  @ApiProperty()
  name: string
  @ApiProperty()
  email: string

  @Exclude()
  @ApiProperty()
  password: string
}
