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
    // console.log(`[controller] game tick players=${Object.keys(_this.players).length}`)
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
    this.currentPlayerId += 1
    const player = new Player(socket, this.currentPlayerId)
    console.log(`[controller] id=${player.id} joined`)
    this.players[socket.id] = player
    socket.emit('startinfo', {
      clientId: player.id,
      world: {
        w: this.world.width,
        h: this.world.height,
        platforms: this.world.platforms
      }
    })
  }

  leave (socket: Socket) {
    console.log(`[controller] id=${this.players[socket.id].id} left`)
    delete this.players[socket.id]
  }
  
  move (socket: Socket, dir: string) {
    const player = this.players[socket.id]
    console.log(`[controller] id=${player.id} moved '${dir}'`)
    const moveSpeed: number = 10
    if (dir === 'left') {
      player.x -= moveSpeed
    } else if (dir === 'right') {
      player.x += moveSpeed
    } else if (dir === 'up') {
      player.y -= moveSpeed
    } else if (dir === 'down') {
      player.y += moveSpeed
    } else {
      console.log(`[controller] illegal direction '${dir}'`)
    }

    // TODO: better clamping
    if (player.x > this.world.width) {
      player.x = this.world.width
    }
    if (player.x < 0) {
      player.x = 0
    }
    if (player.y > this.world.height) {
      player.y = this.world.height
    }
    if (player.y < 0) {
      player.y = 0
    }
  }
}

export default GameController