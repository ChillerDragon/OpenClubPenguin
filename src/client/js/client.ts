import { io, Socket } from 'socket.io-client'

import Pos from '../../shared/pos'
import Platform from '../../shared/platform'
import StartInfo from '../../shared/messages/server/startinfo'

import { ServerToClientEvents, ClientToServerEvents } from '../../shared/socket.io'
import PlayerInfo from '../../shared/messages/server/playerinfo'
import MsgUpdate from '../../shared/messages/server/update'
import PlayerPos from '../../shared/playerpos'
import Player from './player'
import GameClient from './game_client'

interface PlayerIdHash {
  [index: number]: Player
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()
const context = document.querySelector('canvas')!.getContext('2d')

const gameClient = new GameClient(socket)

const players: PlayerIdHash = {}
let ownId: number | null = null
let ownPlayer: Player = new Player(0, '')
let worldHeight = 10
let worldWidth = 10

let platforms: Platform[] = []

const playerImg = new Image()
playerImg.src = '/img/penguin.svg'

const centerAroundPos = (pos: Pos): Pos => {
  if (!pos) {
    return { x: 0, y: 0 }
  }
  const wc = context!.canvas.width / 2
  const hc = context!.canvas.height / 2
  const x = -pos.x + wc
  const y = -pos.y + hc
  return { x, y }
}

socket.on('connect', () => {
  console.log('Successfully connected!')
})

socket.on('startinfo', (startinfo: StartInfo) => {
  ownId = startinfo.clientId
  worldHeight = startinfo.world.h
  worldWidth = startinfo.world.w
  platforms = startinfo.world.platforms
})

socket.on('playerinfos', (playerInfos: PlayerInfo[]) => {
  for (let i = 0; i < playerInfos.length; i++) {
    const info = playerInfos[i]
    if (players[info.id]) { // update player
      players[info.id].username = info.username
    } else { // new player
      players[info.id] = new Player(info.id, info.username)
    }
  }
})

socket.on('update', (updateData: MsgUpdate) => {
  const newPositions: PlayerPos[] = updateData.positions
  for (const newPos of newPositions) {
    if (!players[newPos.id]) {
      players[newPos.id] = new Player(newPos.id, '')
    }
    players[newPos.id].x = newPos.x
    players[newPos.id].y = newPos.y
  }
  // fill background
  context!.fillStyle = 'blue'
  context!.fillRect(0, 0, context!.canvas.width, context!.canvas.height)

  // get camera position
  if (ownId) {
    ownPlayer = players[ownId]
  }
  const offset = centerAroundPos(ownPlayer)

  // draw world
  if (platforms) {
    context!.fillStyle = 'white'
    for (let i = 0; i < platforms.length; i++) {
      const plat = platforms[i]
      context!.fillRect(plat.x + offset.x, plat.y + offset.y, plat.w, plat.h)
    }
  }

  // draw players
  context!.fillStyle = 'black'
  for (const newPos of newPositions) {
    const player = players[newPos.id]
    player.x = newPos.x
    player.y = newPos.y
    context!.drawImage(playerImg, player.x + offset.x, player.y + offset.y, 64, 64)
    context!.textAlign = 'center'
    context!.fillText(player.username, player.x + offset.x + 32, player.y + offset.y - 10)
  }
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
