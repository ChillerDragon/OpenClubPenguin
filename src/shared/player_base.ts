class PlayerBase {
    id: number
    username: string
    x: number
    y: number

    constructor(id: number) {
        this.id = id
        this.username = ''
        this.x = 0
        this.y = 0
    }
}

export default PlayerBase