import Platform from '../../shared/platform'
import Pos from '../../shared/pos'
import { PlayerIdHash } from './game_client'
import Player from './player'

class Render {
  context: CanvasRenderingContext2D | null // TODO: remove the null option here
  playerImg = new Image()
  offset: Pos = { x: 0, y: 0 }

  constructor () {
    this.context = document.querySelector('canvas')!.getContext('2d')
    this.playerImg.src = '/img/penguin.svg'
  }

  centerAroundPos (pos: Pos, w: number, h: number): Pos {
    if (!pos) {
      return { x: 0, y: 0 }
    }
    const wc = w / 2
    const hc = h / 2
    const x = -pos.x + wc
    const y = -pos.y + hc
    return { x, y }
  }

  drawBackground (): void {
    this.context!.fillStyle = 'blue'
    this.context!.fillRect(0, 0, this.context!.canvas.width, this.context!.canvas.height)
  }

  drawWorld (platforms: Platform[]): void {
    if (platforms) {
      this.context!.fillStyle = 'white'
      for (let i = 0; i < platforms.length; i++) {
        const plat = platforms[i]
        this.context!.fillRect(plat.x + this.offset.x, plat.y + this.offset.y, plat.w, plat.h)
      }
    }
  }

  drawPlayers (players: PlayerIdHash): void {
    this.context!.fillStyle = 'black'
    this.context!.textAlign = 'center'
    for (const playerId in players) {
      const player = players[playerId]
      this.context!.drawImage(this.playerImg, player.x + this.offset.x, player.y + this.offset.y, 64, 64)
      this.context!.fillText(player.username, player.x + this.offset.x + 32, player.y + this.offset.y - 10)
    }
  }

  setCameraToPlayer (player: Player): void {
    this.offset = this.centerAroundPos(player, this.context!.canvas.width, this.context!.canvas.height)
  }
}

export default Render
