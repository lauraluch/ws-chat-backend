import type { User } from './User'
import type { Message } from './Message'

export type Room = {
  code: string
  ownerId: string
  ownerName: string
  users: Map<string, User>
  messages: Message[]
}
