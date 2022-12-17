import StartInfo from "./messages/server/startinfo";
import PlayerInfo from "./messages/server/playerinfo";
import MsgUpdate from "./messages/server/update";
import { Socket } from "socket.io";

export interface ServerToClientEvents {
    // ocp
    startinfo: (startinfo: StartInfo) => void
    playerinfos: (playerinfos: Array<PlayerInfo>) => void
    update: (updateData: MsgUpdate) => void
}

export interface ClientToServerEvents {
    // socket.io
    connection: (socket: Socket) => void

    // ocp
    move: (direction: string) => void
    username: (name: string) => void
}
