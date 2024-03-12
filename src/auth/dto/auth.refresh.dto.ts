import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class TokenRefreshDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string
}
