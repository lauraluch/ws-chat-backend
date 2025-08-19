import { Router } from 'express'
import { RoomService } from '../domain/services/RoomService'

export function createWebSocketRouter(roomService: RoomService) {
  const router = Router()

  router.post('/rooms', (req, res) => {
    const { code, ownerSocketId, ownerName, user } = req.body
    if (!code || !ownerSocketId || !ownerName || !user) {
      return res.status(400).json({ error: 'Invalid data' })
    }
    const room = roomService.createRoom(code, ownerSocketId, ownerName, user)
    res.status(201).json(room)
  })

  router.get('/rooms/:code', (req, res) => {
    const { code } = req.params
    const room = roomService.getRoom(code)
    if (!room) return res.status(404).json({ error: 'Room not found.' })
    res.json(room)
  })

  router.post('/rooms/:code/users', (req, res) => {
    const { code } = req.params
    const { socketId, username } = req.body
    if (!socketId || !username) {
      return res.status(400).json({ error: 'Invalid data' })
    }
    const user = roomService.addUserToRoom(code, socketId, username)
    if (!user) return res.status(404).json({ error: 'Room not found.' })
    res.status(201).json(user)
  })

  router.post('/messages', (req, res) => {
    const { socketId, text } = req.body
    if (!socketId || !text) {
      return res.status(400).json({ error: 'Invalid data' })
    }
    const message = roomService.addMessage(socketId, text)
    if (!message) {
      return res.status(404).json({ error: 'User or room not found.' })
    }
    res.status(201).json(message)
  })

  return router
}
