
import { Socket } from 'socket.io-client'
import { ServerToClientEvents, ClientToServerEvents } from '../../shared/socket.io'


class GameClient {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
  constructor(socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
    this.socket = socket
  }
}

export default GameClient