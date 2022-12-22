import { io, Socket } from 'socket.io-client'

import StartInfo from '../../shared/messages/server/startinfo'

import { ServerToClientEvents, ClientToServerEvents } from '../../shared/socket.io'
import PlayerInfo from '../../shared/messages/server/playerinfo'
import MsgUpdate from '../../shared/messages/server/update'
import GameClient from './game_client'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()
const context = document.querySelector('canvas')!.getContext('2d')

const gameClient = new GameClient(socket)

socket.on('connect', () => {
  gameClient.onJoin()
})

socket.on('startinfo', (startinfo: StartInfo) => {
  gameClient.onStartInfo(startinfo)
})

socket.on('playerinfos', (playerInfos: PlayerInfo[]) => {
  gameClient.onPlayerInfos(playerInfos)
})

socket.on('update', (updateData: MsgUpdate) => {
  gameClient.onUpdate(updateData)
})

const keyPress = (event: KeyboardEvent) => {
  const key = event.key
  if (key === 'a') {
    socket.emit('move', 'left')
  }
  if (key === 'd') {
    socket.emit('move', 'right')
  }
  if (key === 'w') {
    socket.emit('move', 'up')
  }
  if (key === 's') {
    socket.emit('move', 'down')
  }
}

window.addEventListener('keydown', keyPress)

const resize = () => {
  context!.canvas.height = document.documentElement.clientHeight
  context!.canvas.width = document.documentElement.clientWidth
}

window.addEventListener('resize', resize)
resize()

const form = document.querySelector('form')
const usernameBox: HTMLInputElement | null = document.querySelector('#username')
// const usernameContainer = document.querySelector('.username-container')
form!.addEventListener('submit', function (event) {
  event.preventDefault()
  socket.emit('username', usernameBox!.value)
  // usernameContainer.style.display = 'none'
})
