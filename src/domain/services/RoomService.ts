import { Room } from '../entities/Room'
import { User } from '../entities/User'
import { Message } from '../entities/Message'
import { generateCommonId } from '../../utils/generateCommonId'

export class RoomService {
  private rooms = new Map<string, Room>()
  private socketToRoom = new Map<string, string>()

  getRoom(code: string) {
    return this.rooms.get(code)
  }

  getRoomBySocket(socketId: string) {
    const code = this.socketToRoom.get(socketId)
    if (!code) return null
    return this.rooms.get(code)
  }

  createRoom(code: string, ownerSocketId: string, ownerName: string, user: User): Room {
    const room: Room = {
      code,
      ownerId: ownerSocketId,
      ownerName,
      users: new Map<string, User>([[ownerSocketId, user]]),
      messages: [],
    }
    this.rooms.set(code, room)
    this.socketToRoom.set(ownerSocketId, code)
    return room
  }

  addUserToRoom(code: string, socketId: string, username: string): User | null {
    const room = this.rooms.get(code)
    if (!room) return null

    const user: User = {
      socketId,
      userId: generateCommonId(),
      username,
    }

    room.users.set(socketId, user)
    this.socketToRoom.set(socketId, code)
    return user
  }

  addMessage(socketId: string, text: string): Message | null {
    const room = this.getRoomBySocket(socketId)
    if (!room) return null

    const user = room.users.get(socketId)
    if (!user) return null

    const message: Message = {
      id: generateCommonId(),
      userId: user.userId,
      username: user.username,
      text,
      timestamp: Date.now(),
    }

    room.messages.push(message)
    return message
  }

  removeUser(socketId: string): { roomCode: string; empty: boolean } | null {
    const code = this.socketToRoom.get(socketId)
    if (!code) return null

    const room = this.rooms.get(code)
    this.socketToRoom.delete(socketId)
    if (!room) return null

    room.users.delete(socketId)
    const empty = room.users.size === 0
    if (empty) this.rooms.delete(code)

    return { roomCode: code, empty }
  }
}
