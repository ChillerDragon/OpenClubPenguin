/* eslint-disable */

// TODO: use es6 and polyfill with webpack

var socket = io();
var context = document.querySelector("canvas").getContext("2d");
var x = 0

var players = {}
var ownId = null
var ownPlayer = {}
var worldHeight = 10
var worldWidth = 10

function centerAroundPos(pos) {
  if (!pos) {
    return {x: 0, y: 0}
  }
  var wc = context.canvas.width / 2
  var hc = context.canvas.height / 2
  var x = -pos.x + wc
  var y = -pos.y + hc
  return {x: x, y: y}
}

socket.on('startinfo', function(startinfo) {
  ownId = startinfo.clientId
  worldHeight = startinfo.world.h
  worldWidth = startinfo.world.w
})

socket.on('update', function(updateData) {
  var newPositions = updateData.positions
  for (let [id, pos] of Object.entries(newPositions)) {
    console.log(`id=${id} x=${pos.x} y=${pos.y}`)
    if (players[id]) { // update player
      players[id].x = pos.x
      players[id].y = pos.y
    } else { // new player
      players[id] = {x: pos.x, y: pos.y}
    }
  }
  // x = data
  // fill background
  context.fillStyle = "white";
  context.fillRect(0, 0, 400, 250);

  if (ownId) {
    ownPlayer = players[ownId]
  }
  var offset = centerAroundPos(ownPlayer)

  // draw players
  context.fillStyle = "black";
  for (let [id, pos] of Object.entries(players)) {
    context.fillRect(pos.x + offset.x, pos.y + offset.y, 10, 10);
  }
});

function keyPress(event) {
  var key = event.key
  if(key === 'a') {
    socket.emit('move', 'left')
    console.log('emit shit')
  }
  if(key === 'd') {
    socket.emit('move', 'right')
  }
  if(key === 'w') {
    socket.emit('move', 'up')
  }
  if(key === 's') {
    socket.emit('move', 'down')
  }
}

window.addEventListener('keydown', keyPress);