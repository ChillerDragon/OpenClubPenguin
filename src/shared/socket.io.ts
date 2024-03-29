import StartInfo from './messages/server/startinfo'
import PlayerInfo from './messages/server/playerinfo'
import MsgUpdate from './messages/server/update'
import { Socket } from 'socket.io'
import Direction from './direction'

export interface ServerToClientEvents {
  // ocp
  startinfo: (startinfo: StartInfo) => void
  playerinfos: (playerinfos: PlayerInfo[]) => void
  update: (updateData: MsgUpdate) => void
}

export interface ClientToServerEvents {
  // socket.io
  connection: (socket: Socket) => void

  // ocp
  move: (direction: Direction) => void
  username: (name: string) => void
}
