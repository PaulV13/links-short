import { ApiProperty } from '@nestjs/swagger'
export class CreateLinkDto {
  @ApiProperty()
  urlOriginal: string
}
