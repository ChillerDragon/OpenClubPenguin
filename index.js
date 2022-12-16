const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

const { GameController } = require('./src/controller/game_controller')

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

const gameController = new GameController()

io.on('connection', (socket) => {
  const ipAddr = socket.client.conn.remoteAddress
  const userAgent = socket.handshake.headers['user-agent']
  console.log(`[*] connect ${ipAddr} ${userAgent}`)
  gameController.join(socket)

  socket.on('disconnect', () => {
    console.log(`[*] disconnect ${ipAddr} ${userAgent}`)
    gameController.leave(socket)
  })
  setTimeout(function () {
    socket.send('Sent a message 4seconds after connection!')
  }, 4000)
})

http.listen(3000, () => {
  console.log('[*] listening on http://localhost:3000')
})

setInterval(gameController.tick, 100, gameController)
