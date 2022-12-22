import Direction from '../../shared/direction'
import GameClient from './game_client'

interface KeyMap {
  [index: string]: boolean | null
}

class InputHandler {
  gameClient: GameClient
  keyMap: KeyMap = {}

  constructor (gameClient: GameClient) {
    this.gameClient = gameClient
  }

  doActions (): void {
    if (this.keyMap['a']) {
      this.gameClient.socket.emit('move', Direction.Left)
    }
    if (this.keyMap['d']) {
      this.gameClient.socket.emit('move', Direction.Right)
    }
    if (this.keyMap['w']) {
      this.gameClient.socket.emit('move', Direction.Up)
    }
    if (this.keyMap['s']) {
      this.gameClient.socket.emit('move', Direction.Down)
    }
  }

  onKeyPress (_this: InputHandler, event: KeyboardEvent): void {
    const key = event.key
    _this.keyMap[key] = true
    _this.doActions()
  }

  onKeyRelease (_this: InputHandler, event: KeyboardEvent): void {
    const key = event.key
    _this.keyMap[key] = false
    _this.doActions()
  }
}

export default InputHandler
