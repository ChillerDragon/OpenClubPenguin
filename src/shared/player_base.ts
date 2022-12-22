import Direction from './direction'

class PlayerBase {
  id: number
  username: string = ''
  x: number = 0
  y: number = 0
  direction: Direction = Direction.Stop
  w: number = 128
  h: number = 128

  constructor (id: number) {
    this.id = id
  }
}

export default PlayerBase
