export function generateRoomCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const blockLength = 6
  const blockCount = 3

  const randomBlock = () =>
    Array.from({ length: blockLength }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')

  return Array.from({ length: blockCount }, randomBlock).join('-')
}
