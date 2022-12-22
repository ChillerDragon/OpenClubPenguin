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

  getDirection (): Direction {
    if (this.keyMap.w && this.keyMap.a) {
      return Direction.UpLeft
    }
    if (this.keyMap.w && this.keyMap.d) {
      return Direction.UpRight
    }
    if (this.keyMap.s && this.keyMap.a) {
      return Direction.DownLeft
    }
    if (this.keyMap.s && this.keyMap.d) {
      return Direction.DownRight
    }
    if (this.keyMap.w) {
      return Direction.Up
    }
    if (this.keyMap.s) {
      return Direction.Down
    }
    if (this.keyMap.a) {
      return Direction.Left
    }
    if (this.keyMap.d) {
      return Direction.Right
    }
    return Direction.Stop
  }

  onKeyPress (_this: InputHandler, event: KeyboardEvent): void {
    const key = event.key
    _this.keyMap[key] = true
  }

  onKeyRelease (_this: InputHandler, event: KeyboardEvent): void {
    const key = event.key
    _this.keyMap[key] = false
  }
}

export default InputHandler
