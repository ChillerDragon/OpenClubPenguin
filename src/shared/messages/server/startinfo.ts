import Platform from '../../platform'

interface StartInfo {
  clientId: number
  world: {
    w: number
    h: number
    platforms: Platform[]
  }
}

export default StartInfo
