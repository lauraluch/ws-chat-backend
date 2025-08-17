import { Server, Socket } from 'socket.io'
import { RoomService } from '../../domain/services/RoomService'
import { generateRoomCode } from '../../presentation/utils/generateRoomCode'

export function registerRoomHandlers(io: Server, socket: Socket, roomService: RoomService) {
  function emitRoomState(roomCode: string) {
    const room = roomService.getRoom(roomCode)
    if (!room) return

    const users = Array.from(room.users.values()).map((u) => ({
      userId: u.userId,
      username: u.username,
    }))

    io.to(roomCode).emit('room_state', {
      code: room.code,
      ownerName: room.ownerName,
      ownerPresent: room.users.has(room.ownerId),
      users,
      messages: room.messages,
    })
  }

  socket.on('create_room', (payload: { username: string }, ack?: Function) => {
    const username = (payload?.username || '').trim()
    if (!username) return ack?.({ ok: false, error: 'USERNAME_REQUIRED' })

    const code = generateRoomCode()
    const user = { socketId: socket.id, userId: Date.now().toString(), username }
    const room = roomService.createRoom(code, socket.id, username, user)

    socket.join(code)
    emitRoomState(code)
    ack?.({ ok: true, code, username })
  })

  socket.on('join_room', (payload: { username: string; code: string }, ack?: Function) => {
    const username = (payload?.username || '').trim()
    const code = (payload?.code || '').trim().toLowerCase()
    if (!username) return ack?.({ ok: false, error: 'USERNAME_REQUIRED' })
    if (!code) return ack?.({ ok: false, error: 'ROOM_CODE_REQUIRED' })

    const user = roomService.addUserToRoom(code, socket.id, username)
    if (!user) return ack?.({ ok: false, error: 'ROOM_NOT_FOUND' })

    socket.join(code)
    emitRoomState(code)
    ack?.({ ok: true, code })
  })

  socket.on('send_message', (payload: { text: string }) => {
    const text = (payload?.text || '').trim()
    if (!text) return

    const message = roomService.addMessage(socket.id, text)
    if (message) {
      const room = roomService.getRoomBySocket(socket.id)
      if (room) io.to(room.code).emit('new_message', message)
    }
  })

  socket.on('leave_room', (ack?: Function) => {
    const result = roomService.removeUser(socket.id)
    if (!result) return ack?.({ ok: true })

    if (!result.empty) emitRoomState(result.roomCode)
    ack?.({ ok: true })
  })

  socket.on('request_room_state', () => {
    const room = roomService.getRoomBySocket(socket.id)
    if (room) emitRoomState(room.code)
  })

  socket.on('disconnect', () => {
    const result = roomService.removeUser(socket.id)
    if (result && !result.empty) emitRoomState(result.roomCode)
  })
}
