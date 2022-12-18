import { Socket } from 'socket.io'
import Player from '../models/player'
import World from '../models/world'
import PlayerInfo from '../../shared/messages/server/playerinfo'
import PlayerPos from '../../shared/playerpos'
import MsgUpdate from '../../shared/messages/server/update'

interface PlayerList {
  [index: string]: Player
}

class GameController {
  pos: number = 0
  players: PlayerList = {}
  currentPlayerId: number = 0
  world: World = new World(1024, 1024)

  tick (_this: GameController): void {
    // console.log(`[controller] game tick players=${Object.keys(_this.players).length}`)
    // build pos data
    const positions: PlayerPos[] = []
    for (const playerId in _this.players) {
      const player = _this.players[playerId]
      positions.push({
        id: player.id,
        x: player.x,
        y: player.y
      })
    }
    // send pos data to all clients
    const msgUpdate: MsgUpdate = {
      positions
    }
    for (const playerId in _this.players) {
      const player = _this.players[playerId]
      player.socket.emit('update', msgUpdate)
    }
  }

  onJoin (socket: Socket): void {
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
    this.sendPlayerInfo(socket)
  }

  onLeave (socket: Socket): void {
    console.log(`[controller] id=${this.players[socket.id].id} left`)
    delete this.players[socket.id]
  }

  buildPlayerInfo (): PlayerInfo[] {
    // build username data
    const playerData: PlayerInfo[] = []
    for (const playerId in this.players) {
      const player = this.players[playerId]
      playerData.push({ id: player.id, username: player.username })
    }
    return playerData
  }

  sendPlayerInfo (socket: Socket): void {
    const playerInfos = this.buildPlayerInfo()
    console.log(`[controller] send to=${socket.id} infos=${playerInfos}`)
    socket.emit('playerinfos', playerInfos)
  }

  sendPlayerInfoAll (): void {
    // send pos data to all clients
    for (const playerId in this.players) {
      const player = this.players[playerId]
      this.sendPlayerInfo(player.socket)
    }
  }

  onUsername (socket: Socket, name: string): void {
    const player = this.players[socket.id]
    name = name.slice(0, 32)
    name = name.replace(/[^a-zA-Z0-9]/g, '_')
    console.log(`[controller] id=${player.id} set username '${name}'`)
    player.username = name
    this.sendPlayerInfoAll()
  }

  onMove (socket: Socket, dir: string): void {
    const player = this.players[socket.id]
    // console.log(`[controller] id=${player.id} moved '${dir}'`)
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
