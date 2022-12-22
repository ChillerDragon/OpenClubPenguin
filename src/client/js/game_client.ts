import { Socket } from 'socket.io-client'
import StartInfo from '../../shared/messages/server/startinfo'
import Platform from '../../shared/platform'
import Player from './player'
import { ServerToClientEvents, ClientToServerEvents } from '../../shared/socket.io'
import PlayerInfo from '../../shared/messages/server/playerinfo'
import MsgUpdate from '../../shared/messages/server/update'
import PlayerPos from '../../shared/playerpos'
import Pos from '../../shared/pos'

interface PlayerIdHash {
  [index: number]: Player
}

const centerAroundPos = (pos: Pos, w: number, h: number): Pos => {
  if (!pos) {
    return { x: 0, y: 0 }
  }
  const wc = w / 2
  const hc = h / 2
  const x = -pos.x + wc
  const y = -pos.y + hc
  return { x, y }
}

class GameClient {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
  ownId: number | null = null
  worldHeight: number = 10
  worldWidth: number = 10
  platforms: Platform[] = []
  players: PlayerIdHash = {}
  ownPlayer: Player = new Player(0, '')
  context: CanvasRenderingContext2D | null // TODO: remove the null option here
  playerImg = new Image()

  constructor (socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
    this.socket = socket
    // TODO: remove context and drawing to a new class
    this.context = document.querySelector('canvas')!.getContext('2d')
    this.playerImg.src = '/img/penguin.svg'
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
    // fill background
    this.context!.fillStyle = 'blue'
    this.context!.fillRect(0, 0, this.context!.canvas.width, this.context!.canvas.height)

    // get camera position
    if (this.ownId) {
      this.ownPlayer = this.players[this.ownId]
    }
    const offset = centerAroundPos(this.ownPlayer, this.context!.canvas.width, this.context!.canvas.height)

    // draw world
    if (this.platforms) {
      this.context!.fillStyle = 'white'
      for (let i = 0; i < this.platforms.length; i++) {
        const plat = this.platforms[i]
        this.context!.fillRect(plat.x + offset.x, plat.y + offset.y, plat.w, plat.h)
      }
    }

    // draw players
    this.context!.fillStyle = 'black'
    for (const newPos of newPositions) {
      const player = this.players[newPos.id]
      player.x = newPos.x
      player.y = newPos.y
      this.context!.drawImage(this.playerImg, player.x + offset.x, player.y + offset.y, 64, 64)
      this.context!.textAlign = 'center'
      this.context!.fillText(player.username, player.x + offset.x + 32, player.y + offset.y - 10)
    }
  }
}

export default GameClient
