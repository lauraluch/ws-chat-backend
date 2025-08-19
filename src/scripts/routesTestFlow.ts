// testApi.ts
import axios from 'axios'
import { generateCommonId } from '../utils/generateCommonId'
import { generateRoomCode } from '../utils/generateRoomCode'

const API_URL = 'http://localhost:3001/api'

async function runTests() {
  try {
    console.log('••••• Testing routes •••••')
    console.log('\n⤷ Creating chat room')
    const roomCode = generateRoomCode()

    const createRoomRes = await axios.post(`${API_URL}/rooms`, {
      code: roomCode,
      ownerSocketId: 'socket123',
      ownerName: 'Laura',
      user: { socketId: 'socket123', userId: generateCommonId(), username: 'Laura' },
    })
    console.log('✧ Room created:', createRoomRes.data)

    console.log('\n⤷ Searching for created room')
    const getRoomRes = await axios.get(`${API_URL}/rooms/${roomCode}`)
    console.log('✧ Found room:', getRoomRes.data)

    // const randomNonExistentRoomCode = generateRoomCode()
    // console.log("\n⤷ Searching for non-existing room")
    // const getRoomRes2 = await axios.get(`${API_URL}/rooms/${randomNonExistentRoomCode}`)
    // console.log("✧ Found room:", getRoomRes2.data)

    console.log('\n⤷ Adding user to room')
    const addUserRes = await axios.post(`${API_URL}/rooms/${roomCode}/users`, {
      socketId: 'socket456',
      username: 'Maria',
    })
    console.log('✧ User added:', addUserRes.data)

    console.log('\n⤷ Adding message...')
    await axios.post(`${API_URL}/messages`, {
      socketId: 'socket456',
      text: "Hello, I'm Maria! What's your name?",
    })
    console.log('✧ Message sent.')

    console.log('\n⤷ Adding message...')
    await axios.post(`${API_URL}/messages`, {
      socketId: 'socket123',
      text: "Sup' Maria, I'm  Laura.",
    })
    console.log('✧ Message sent.')

    console.log('\n⤷ Searching for room again - should have new users and messages')
    const getRoomAgainRes = await axios.get(`${API_URL}/rooms/${roomCode}`)
    console.log('✧ Updated room:', JSON.stringify(getRoomAgainRes.data, null, 2))
  } catch (err: any) {
    console.log('••••••••••')
    console.error(`Error during tests:`, err.response?.data || err.message)
  }
}

runTests()
