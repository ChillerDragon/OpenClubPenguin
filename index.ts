import express = require('express')
import { Socket } from 'socket.io'
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

import GameController from './src/server/controller/game_controller'

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

app.use(express.static('dist'))

http.listen(6827, () => {
  console.log('[*] listening on http://localhost:6827')
})

setInterval(gameController.tick, 100, gameController)
