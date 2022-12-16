import express = require('express')
import { Socket } from 'socket.io'
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

import GameController from './src/server/controller/game_controller'

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'))
})

// TODO: use webpacker or another file server
//       to properly polyfill and minify
app.get('/client/client.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../src/client/client.js'))
})

const gameController = new GameController()

io.on('connection', (socket: Socket) => {
  const ipAddr = socket.client.conn.remoteAddress
  const userAgent = socket.handshake.headers['user-agent']
  console.log(`[*] connect ${ipAddr} ${userAgent}`)
  gameController.join(socket)

  socket.on('disconnect', () => {
    console.log(`[*] disconnect ${ipAddr} ${userAgent}`)
    gameController.leave(socket)
  })

  socket.on('move', (dir: string) => {
    gameController.move(socket, dir)
  })
})

http.listen(3000, () => {
  console.log('[*] listening on http://localhost:3000')
})

setInterval(gameController.tick, 100, gameController)
