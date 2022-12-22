import { Socket } from 'socket.io'
import Player from '../models/player'
import World from '../models/world'
import PlayerInfo from '../../shared/messages/server/playerinfo'
import PlayerPos from '../../shared/playerpos'
import MsgUpdate from '../../shared/messages/server/update'
import { ClientToServerEvents, ServerToClientEvents } from '../../shared/socket.io'
import Direction from '../../shared/direction'

interface PlayerList {
  [index: string]: Player
}

class GameController {
  pos: number = 0
  players: PlayerList = {}
  currentPlayerId: number = 0
  world: World = new World(3000, 3000)

  tick (_this: GameController): void {
    // console.log(`[controller] game tick players=${Object.keys(_this.players).length}`)
    // update positions
    for (const playerId in _this.players) {
      const player: Player = _this.players[playerId]
      const dir: Direction = player.direction
      const moveSpeed: number = 4
      if (dir === Direction.Left) {
        player.x -= moveSpeed
      } else if (dir === Direction.Right) {
        player.x += moveSpeed
      } else if (dir === Direction.Up) {
        player.y -= moveSpeed
      } else if (dir === Direction.Down) {
        player.y += moveSpeed
      } else if (dir === Direction.UpLeft) {
        player.x -= moveSpeed
        player.y -= moveSpeed
      } else if (dir === Direction.UpRight) {
        player.x += moveSpeed
        player.y -= moveSpeed
      } else if (dir === Direction.DownLeft) {
        player.x -= moveSpeed
        player.y += moveSpeed
      } else if (dir === Direction.DownRight) {
        player.x += moveSpeed
        player.y += moveSpeed
      }
      // TODO: better clamping
      if (player.x > _this.world.width) {
        player.x = _this.world.width
      }
      if (player.x < 0) {
        player.x = 0
      }
      if (player.y > _this.world.height) {
        player.y = _this.world.height
      }
      if (player.y < 0) {
        player.y = 0
      }
    }
    // build pos data
    const positions: PlayerPos[] = []
    for (const playerId in _this.players) {
      const player: Player = _this.players[playerId]
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

  onJoin (socket: Socket<ClientToServerEvents, ServerToClientEvents>): void {
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

  onLeave (socket: Socket<ClientToServerEvents, ServerToClientEvents>): void {
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

  sendPlayerInfo (socket: Socket<ClientToServerEvents, ServerToClientEvents>): void {
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

  onUsername (socket: Socket<ClientToServerEvents, ServerToClientEvents>, name: string): void {
    const player = this.players[socket.id]
    name = name.slice(0, 32)
    name = name.replace(/[^a-zA-Z0-9]/g, '_')
    console.log(`[controller] id=${player.id} set username '${name}'`)
    player.username = name
    this.sendPlayerInfoAll()
  }

  onMove (socket: Socket<ClientToServerEvents, ServerToClientEvents>, dir: Direction): void {
    const player = this.players[socket.id]
    if (!Object.keys(Direction).includes(dir)) {
      console.log(`[controller] illegal direction '${dir}' allowed: ${Object.keys(Direction)}`)
      return
    }
    player.direction = dir
    console.log(`[controller] id=${player.id} moved '${dir}'`)
  }
}

export default GameController
