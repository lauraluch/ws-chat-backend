import type { User } from './User'
import type { Message } from './Message'

export type Room = {
  code: string
  ownerId: string
  ownerName: string
  ownerSocketId: string
  users: Map<string, User>
  messages: Message[]
  createdAt: string
}
