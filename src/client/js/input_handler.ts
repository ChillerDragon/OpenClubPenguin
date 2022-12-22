import Direction from '../../shared/direction'
import { Socket } from 'socket.io-client'
import { ServerToClientEvents, ClientToServerEvents } from '../../shared/socket.io'

interface KeyMap {
  [index: string]: boolean | null
}

class InputHandler {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
  keyMap: KeyMap = {}

  constructor (socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
    this.socket = socket
  }

  doActions (): void {
    if (this.keyMap['a']) {
      this.socket.emit('move', Direction.Left)
    }
    if (this.keyMap['d']) {
      this.socket.emit('move', Direction.Right)
    }
    if (this.keyMap['w']) {
      this.socket.emit('move', Direction.Up)
    }
    if (this.keyMap['s']) {
      this.socket.emit('move', Direction.Down)
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
