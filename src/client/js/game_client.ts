import { Socket } from 'socket.io-client'
import StartInfo from '../../shared/messages/server/startinfo'
import Platform from '../../shared/platform'
import Player from './player'
import { ServerToClientEvents, ClientToServerEvents } from '../../shared/socket.io'
import PlayerInfo from '../../shared/messages/server/playerinfo'
import MsgUpdate from '../../shared/messages/server/update'
import PlayerPos from '../../shared/playerpos'
import Render from './render'

export interface PlayerIdHash {
  [index: number]: Player
}

class GameClient {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
  ownId: number | null = null
  worldHeight: number = 10
  worldWidth: number = 10
  platforms: Platform[] = []
  players: PlayerIdHash = {}
  ownPlayer: Player = new Player(0, '')
  render: Render

  constructor (socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
    this.socket = socket
    this.render = new Render()
  }

  onJoin (): void {
    console.log('connected to server.')
  }

  onStartInfo (startinfo: StartInfo): void {
    this.ownId = startinfo.clientId
    this.worldHeight = startinfo.world.h
    this.worldWidth = startinfo.world.w
    this.platforms = startinfo.world.platforms
  }

  onPlayerInfos (playerInfos: PlayerInfo[]): void {
    for (let i = 0; i < playerInfos.length; i++) {
      const info = playerInfos[i]
      if (this.players[info.id]) { // update player
        this.players[info.id].username = info.username
      } else { // new player
        this.players[info.id] = new Player(info.id, info.username)
      }
    }
  }

  onUpdate (updateData: MsgUpdate): void {
    const newPositions: PlayerPos[] = updateData.positions
    for (const newPos of newPositions) {
      if (!this.players[newPos.id]) {
        this.players[newPos.id] = new Player(newPos.id, '')
      }
      this.players[newPos.id].x = newPos.x
      this.players[newPos.id].y = newPos.y
    }
    if (this.ownId) {
      this.ownPlayer = this.players[this.ownId]
    }
    for (const newPos of newPositions) {
      const player = this.players[newPos.id]
      player.x = newPos.x
      player.y = newPos.y
    }

    this.render.setCameraToPlayer(this.ownPlayer)
    this.render.drawBackground()
    this.render.drawWorld(this.platforms)
    this.render.drawPlayers(this.players)
  }
}

export default GameClient
