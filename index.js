const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

io.on('connection', (socket) => {
  const ipAddr = socket.client.conn.remoteAddress
  const userAgent = socket.handshake.headers['user-agent']
  console.log(`[*] connect ${ipAddr} ${userAgent}`)

  socket.on('disconnect', () => {
    console.log(`[*] disconnect ${ipAddr} ${userAgent}`)
  })
})
http.listen(3000, () => {
  console.log('[*] listening on http://localhost:3000')
})
