class GameController {
  constructor () {
    this.clients = {}
    this.pos = 0
  }

  tick (_this) {
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

  join (socket) {
    console.log('[controller] someone joined')
    this.clients[socket.id] = socket
  }

  leave (socket) {
    console.log('[controller] someone left')
    delete this.clients[socket.id]
  }
}

module.exports = { GameController }
