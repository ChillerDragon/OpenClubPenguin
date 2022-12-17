import Platform from "../../platform"

interface StartInfo {
  clientId: number,
  world: {
    w: number,
    h: number,
    platforms: Array<Platform>
  }
}

export default StartInfo