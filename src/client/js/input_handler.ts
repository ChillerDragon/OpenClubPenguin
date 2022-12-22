import Direction from '../../shared/direction'
import GameClient from './game_client'

class InputHandler {
  gameClient: GameClient

  constructor (gameClient: GameClient) {
    this.gameClient = gameClient
  }

  onKeyPress (_this: InputHandler, event: KeyboardEvent): void {
    const key = event.key
    if (key === 'a') {
      _this.gameClient.socket.emit('move', Direction.Left)
    }
    if (key === 'd') {
      _this.gameClient.socket.emit('move', Direction.Right)
    }
    if (key === 'w') {
      _this.gameClient.socket.emit('move', Direction.Up)
    }
    if (key === 's') {
      _this.gameClient.socket.emit('move', Direction.Down)
    }
  }
}

export default InputHandler
