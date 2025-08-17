export function generateRoomCode(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let outString = ''
  const length = 7

  for (let i = 0; i < length; i++) {
    outString += alphabet[Math.floor(Math.random() * alphabet.length)]
  }

  return outString
}
