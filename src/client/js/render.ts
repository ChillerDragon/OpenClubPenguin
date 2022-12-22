import Platform from '../../shared/platform'
import Pos from '../../shared/pos'
import { PlayerIdHash } from './game_client'
import Player from './player'

class Camera {
  x: number = 0
  y: number = 0
  zoom: number = 1
}

class Render {
  context: CanvasRenderingContext2D | null // TODO: remove the null option here
  playerImg = new Image()
  offset: Pos = { x: 0, y: 0 }
  camera: Camera = new Camera()

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
        this.context!.fillRect(
          plat.x * this.camera.zoom + this.camera.x,
          plat.y * this.camera.zoom + this.camera.y,
          plat.w * this.camera.zoom,
          plat.h * this.camera.zoom)
      }
    }
  }

  drawPlayers (players: PlayerIdHash): void {
    this.context!.fillStyle = 'black'
    this.context!.textAlign = 'center'
    for (const playerId in players) {
      const player = players[playerId]
      this.context!.drawImage(
        this.playerImg,
        player.x * this.camera.zoom + this.camera.x,
        player.y * this.camera.zoom + this.camera.y,
        64 * this.camera.zoom,
        64 * this.camera.zoom)
      this.context!.fillText(
        player.username,
        player.x * this.camera.zoom + this.camera.x + 32,
        player.y * this.camera.zoom + this.camera.y - 10)
    }
  }

  zoomIn () {
    this.camera.zoom *= 1.5
  }

  zoomOut () {
    this.camera.zoom /= 1.5
  }

  setCameraToPlayer (player: Player): void {
    const offset = this.centerAroundPos(player, this.context!.canvas.width, this.context!.canvas.height)
    this.camera.x = offset.x
    this.camera.y = offset.y
  }
}

export default Render
