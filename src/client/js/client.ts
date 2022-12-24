import { io, Socket } from 'socket.io-client'

import StartInfo from '../../shared/messages/server/startinfo'

import { ServerToClientEvents, ClientToServerEvents } from '../../shared/socket.io'
import PlayerInfo from '../../shared/messages/server/playerinfo'
import MsgUpdate from '../../shared/messages/server/update'
import GameClient from './game_client'
import InputHandler from './input_handler'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()
const canvas = document.querySelector('canvas')
const context = canvas!.getContext('2d')

const inputHandler = new InputHandler(socket)
const gameClient = new GameClient(socket, inputHandler)

socket.on('connect', () => {
  gameClient.onJoin()
})

socket.on('startinfo', (startinfo: StartInfo) => {
  gameClient.onStartInfo(startinfo)
})

socket.on('playerinfos', (playerInfos: PlayerInfo[]) => {
  gameClient.onPlayerInfos(playerInfos)
})

socket.on('update', (updateData: MsgUpdate) => {
  gameClient.onUpdate(updateData)
})

const resize = () => {
  context!.canvas.height = document.documentElement.clientHeight
  context!.canvas.width = document.documentElement.clientWidth
  gameClient.userInterface.registerUiElements() // calculate pos based on new size
}

canvas?.addEventListener('click', (event: MouseEvent) => {
  gameClient.userInterface.onClick(event)
})

window.addEventListener('keydown', (event: KeyboardEvent) => {
  inputHandler.onKeyPress(inputHandler, event)
  gameClient.onInput()
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
  inputHandler.onKeyRelease(inputHandler, event)
  gameClient.onInput()
})

window.addEventListener('wheel', (event: WheelEvent) => {
  if (event.deltaY < 0) { // up (unnatural scroll: move view not content)
    gameClient.render.zoomIn()
  } else { // down (unnatural scroll: move view not content)
    gameClient.render.zoomOut()
  }
})

const renderTick = () => {
  gameClient.renderTick()
  window.requestAnimationFrame(renderTick)
}
window.requestAnimationFrame(renderTick)

window.addEventListener('resize', resize)
resize()

const form = document.querySelector('form')
const usernameBox: HTMLInputElement | null = document.querySelector('#username')
// const usernameContainer = document.querySelector('.username-container')
form!.addEventListener('submit', function (event) {
  event.preventDefault()
  socket.emit('username', usernameBox!.value)
  // usernameContainer.style.display = 'none'
})
