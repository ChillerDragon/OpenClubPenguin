import { io, Socket } from "socket.io-client";

import Pos from "../../shared/pos"
import Platform from "../../shared/platform"
import StartInfo from "../../shared/messages/client/startinfo";

import { ServerToClientEvents, ClientToServerEvents } from "../../shared/socket.io"
import PlayerInfo from "../../shared/messages/server/playerinfo";
import MsgUpdate from "../../shared/messages/server/update";
import PlayerPos from "../../shared/playerpos";

interface SimplePlayer {
  x: number
  y: number
  username: string
}

interface PlayerPosList {
  [index: number]: SimplePlayer
}

interface UpdateData {
  positions: PlayerPosList
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
const context = document.querySelector('canvas')!.getContext('2d');

const players: PlayerPosList = {}
let ownId: number | null = null
let ownPlayer: SimplePlayer = {x: 0, y: 0, username: ''}
let worldHeight = 10
let worldWidth = 10

let platforms: Array<Platform> = []

const playerImg = new Image()
playerImg.src = '/img/penguin.svg'

const centerAroundPos = (pos: Pos) => {
  if (!pos) {
    return {x: 0, y: 0}
  }
  var wc = context!.canvas.width / 2
  var hc = context!.canvas.height / 2
  var x = -pos.x + wc
  var y = -pos.y + hc
  return {x: x, y: y}
}

socket.on('connect', function() {
  console.log('Successfully connected!');
})

socket.on('startinfo', (startinfo: StartInfo) => {
  ownId = startinfo.clientId
  worldHeight = startinfo.world.h
  worldWidth = startinfo.world.w
  platforms = startinfo.world.platforms
})

socket.on('playerinfos', (playerInfos: Array<PlayerInfo>) => {
  for(var i = 0; i < playerInfos.length; i++) {
    var info = playerInfos[i]
    if (players[info.id]) { // update player
      players[info.id].username = info.username
    } else { // new player
      players[info.id] = {x: 0, y: 0, username: info.username }
    }
  }
})

socket.on('update', (updateData: MsgUpdate) => {
  const newPositions: Array<PlayerPos> = updateData.positions
  for (const newPos of newPositions) {
    if (players[newPos.id]) { // update player
      players[newPos.id].x = newPos.x
      players[newPos.id].y = newPos.y
    } else { // new player
      players[newPos.id] = {x: newPos.x, y: newPos.y, username: ''}
    }
  }
  // fill background
  context!.fillStyle = 'blue';
  context!.fillRect(0, 0, context!.canvas.width, context!.canvas.height)

  // get camera position
  if (ownId) {
    ownPlayer = players[ownId]
  }
  var offset = centerAroundPos(ownPlayer)

  // draw world
  if (platforms) {
    context!.fillStyle = 'white';
    for(var i = 0; i < platforms.length; i++) {
      var plat = platforms[i]
      context!.fillRect(plat.x + offset.x, plat.y + offset.y, plat.w, plat.h);
    }
  }

  // draw players
  context!.fillStyle = 'black';
  for (const newPos of newPositions) {
    var player = players[newPos.id]
    player.x = newPos.x
    player.y = newPos.y
    context!.drawImage(playerImg, player.x + offset.x, player.y + offset.y, 64, 64)
    context!.textAlign = 'center'
    context!.fillText(player.username, player.x + offset.x + 32, player.y + offset.y - 10); 
  }
});

function keyPress(event: KeyboardEvent) {
  var key = event.key
  if(key === 'a') {
    socket.emit('move', 'left')
  }
  if(key === 'd') {
    socket.emit('move', 'right')
  }
  if(key === 'w') {
    socket.emit('move', 'up')
  }
  if(key === 's') {
    socket.emit('move', 'down')
  }
}

window.addEventListener('keydown', keyPress);

function resize() {
  context!.canvas.height = document.documentElement.clientHeight
  context!.canvas.width = document.documentElement.clientWidth
}

window.addEventListener('resize', resize)
resize()

var form = document.querySelector('form')
var usernameBox: HTMLInputElement | null = document.querySelector('#username')
var usernameContainer = document.querySelector('.username-container')
form!.addEventListener('submit', function(event) {
  event.preventDefault()
  socket.emit('username', usernameBox!.value)
  // usernameContainer.style.display = 'none'
})