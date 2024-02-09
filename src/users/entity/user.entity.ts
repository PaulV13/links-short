import { Exclude } from 'class-transformer'

export class User {
  id: number
  name: string
  email: string

  @Exclude()
  password: string
}
