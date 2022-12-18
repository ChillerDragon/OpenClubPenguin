import PlayerBase from '../../shared/player_base'

class Player extends PlayerBase {
  constructor (id: number, username: string) {
    super(id)

    this.username = username
  }
}

export default Player
