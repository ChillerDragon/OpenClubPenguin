import { Socket } from 'socket.io'
import PlayerBase from '../../shared/player_base'

class Player extends PlayerBase {
  socket: Socket

  constructor (socket: Socket, id: number) {
    super(id)

    this.socket = socket
  }
}

export default Player
