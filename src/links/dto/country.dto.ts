import { ApiProperty } from '@nestjs/swagger'

export class CountryDto {
  @ApiProperty()
  country: string
  @ApiProperty()
  visits: number
}
