import express from 'express'
import { Socket } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from '../shared/socket.io'
const app = express()
const http = require('http').Server(app)
const io: Socket<ClientToServerEvents, ServerToClientEvents> = require('socket.io')(http)

import GameController from './controller/game_controller'

const gameController = new GameController()

io.on('connection', (socket: Socket) => {
  const ipAddr = socket.client.conn.remoteAddress
  const userAgent = socket.handshake.headers['user-agent']
  console.log(`[*] connect ${ipAddr} ${userAgent}`)
  gameController.onJoin(socket)

  socket.on('disconnect', () => {
    console.log(`[*] disconnect ${ipAddr} ${userAgent}`)
    gameController.onLeave(socket)
  })

  socket.on('move', (dir: string) => {
    gameController.onMove(socket, dir)
  })

  socket.on('username', (name: string) => {
    gameController.onUsername(socket, name)
  })
})

app.use(express.static('dist/client'))

http.listen(6827, () => {
  console.log('[*] listening on http://localhost:6827')
})

setInterval(gameController.tick, 100, gameController)
