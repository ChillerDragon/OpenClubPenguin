import { Socket } from "socket.io"
import Player from "../models/player"
import World from "../models/world"

interface PlayerList {
  [index: string]: Player
}

interface Pos {
  [index: string]: number
}
interface PlayerPosList {
  [index: number]: Pos
}

class GameController {
  pos: number = 0
  players: PlayerList = {}
  currentPlayerId: number = 0
  world: World = new World(1024, 1024)

  tick (_this: GameController) {
    console.log(`[controller] game tick yo pos=${_this.pos} players=${Object.keys(_this.players).length}`)
    // build pos data
    const posData: PlayerPosList = {}
    for (const playerId in _this.players) {
      const player = _this.players[playerId]
      posData[player.id] = {x: player.x, y: player.y}
    }
    // send pos data to all clients
    for (const playerId in _this.players) {
      const player = _this.players[playerId]
      player.socket.emit('update', {positions: posData})
    }
  }

  join (socket: Socket) {
    console.log('[controller] someone joined')
    this.currentPlayerId += 1
    const player = new Player(socket, this.currentPlayerId)
    this.players[socket.id] = player
    socket.emit('startinfo', {
      clientId: player.id,
      world: { w: this.world.width, h: this.world.height }
    })
  }

  leave (socket: Socket) {
    console.log('[controller] someone left')
    delete this.players[socket.id]
  }
  
  move (socket: Socket, dir: string) {
    console.log(`[controller] someone moved ${dir}`)
    const moveSpeed: number = 10
    if (dir === 'left') {
      this.players[socket.id].x -= moveSpeed
    } else if (dir === 'right') {
      this.players[socket.id].x += moveSpeed
    } else if (dir === 'up') {
      this.players[socket.id].y -= moveSpeed
    } else if (dir === 'down') {
      this.players[socket.id].y += moveSpeed
    } else {
      console.log(`[controller] illegal direction ${dir}`)
    }

    // TODO: better clamping
    if (this.players[socket.id].x > this.world.width) {
      this.players[socket.id].x = 0
    }
    if (this.players[socket.id].x < 0) {
      this.players[socket.id].x = 100
    }
    if (this.players[socket.id].y > this.world.height) {
      this.players[socket.id].y = 0
    }
    if (this.players[socket.id].y < 0) {
      this.players[socket.id].y = 100
    }
  }
}

export default GameController