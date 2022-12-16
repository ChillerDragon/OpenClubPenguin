import { Socket } from "socket.io"

interface ClientList {
  [index: string]: Socket
}

class GameController {
  pos: number = 0
  clients: ClientList = {}

  tick (_this: GameController) {
    console.log(`[controller] game tick yo pos=${_this.pos} clients=${Object.keys(_this.clients).length}`)
    _this.pos += 2
    if (_this.pos > 100) {
      _this.pos = 0
    }
    for (const clientId in _this.clients) {
      const client = _this.clients[clientId]
      client.emit('pos', _this.pos)
    }
  }

  join (socket: Socket) {
    console.log('[controller] someone joined')
    this.clients[socket.id] = socket
  }

  leave (socket: Socket) {
    console.log('[controller] someone left')
    delete this.clients[socket.id]
  }
}

export default GameController