import { Socket } from 'socket.io'

class Player {
    socket: Socket
    id: number
    username: string
    x: number
    y: number

    constructor(socket: Socket, id: number) {
        this.socket = socket
        this.id = id
        this.username = ''
        this.x = 0
        this.y = 0
    }
}

export default Player