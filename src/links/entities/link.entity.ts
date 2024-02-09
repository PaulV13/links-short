import { Exclude } from 'class-transformer'

export class Link {
  id: number
  url_original: string
  url_short: string
  visits: number
  @Exclude()
  userId: number | null
}
