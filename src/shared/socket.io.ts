import StartInfo from "./messages/server/startinfo";
import PlayerInfo from "./messages/server/playerinfo";
import MsgUpdate from "./messages/server/update";

export interface ServerToClientEvents {
    startinfo: (startinfo: StartInfo) => void
    playerinfos: (playerinfos: Array<PlayerInfo>) => void
    update: (updateData: MsgUpdate) => void
}

export interface ClientToServerEvents {
    move: (direction: string) => void
    username: (name: string) => void
}
