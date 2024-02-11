import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class Link {
  @ApiProperty()
  id: number
  @ApiProperty()
  url_original: string
  @ApiProperty()
  url_short: string
  @ApiProperty()
  visits: number
  @ApiProperty()
  @Exclude()
  userId: number | null
}
