import 'dotenv/config'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { RoomService } from '../domain/services/RoomService'
import { registerRoomHandlers } from '../application/sockets/roomHandlers'
import { createWebSocketRouter } from '../routes/webSocketRouter'

const app = express()
app.use(cors())
app.use(express.json()) 

app.get('/', (_req, res) => res.send('socket.io chat backend is running ;)'))

const roomService = new RoomService()
app.use('/api', createWebSocketRouter(roomService))

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })


io.on('connection', (socket) => {
  console.log('⚡ Novo cliente conectado:', socket.id)
  registerRoomHandlers(io, socket, roomService)
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`WS Chat running on http://localhost:${PORT} ;)`)
})
