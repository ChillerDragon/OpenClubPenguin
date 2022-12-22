import express from 'express'
import { Socket } from 'socket.io'
import Direction from '../shared/direction'
import { ClientToServerEvents, ServerToClientEvents } from '../shared/socket.io'

import GameController from './controller/game_controller'
const app = express()
const http = require('http').Server(app)
const io: Socket<ClientToServerEvents, ServerToClientEvents> = require('socket.io')(http)

const gameController = new GameController()

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>): void => {
  const ipAddr = socket.client.conn.remoteAddress
  const userAgent = socket.handshake.headers['user-agent']
  console.log(`[*] connect ${ipAddr} ${userAgent}`)
  gameController.onJoin(socket)

  socket.on('disconnect', (): void => {
    console.log(`[*] disconnect ${ipAddr} ${userAgent}`)
    gameController.onLeave(socket)
  })

  socket.on('move', (dir: Direction): void => {
    gameController.onMove(socket, dir)
  })

  socket.on('username', (name: string): void => {
    gameController.onUsername(socket, name)
  })
})

app.use(express.static('dist/client'))

http.listen(6827, (): void => {
  console.log('[*] listening on http://localhost:6827')
})

setInterval(gameController.tick, 10, gameController)
