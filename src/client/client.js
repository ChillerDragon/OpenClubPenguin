/* eslint-disable */

// TODO: use es6 and polyfill with webpack

var socket = io();
var context = document.querySelector('canvas').getContext('2d');
var x = 0

var players = {}
var ownId = null
var ownPlayer = {}
var worldHeight = 10
var worldWidth = 10

var platforms = []

var playerImg = new Image()
playerImg.src = '/img/penguin.svg'

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
  platforms = startinfo.world.platforms
})

socket.on('update', function(updateData) {
  var newPositions = updateData.positions
  for (let [id, pos] of Object.entries(newPositions)) {
    // console.log(`id=${id} x=${pos.x} y=${pos.y}`)
    if (players[id]) { // update player
      players[id].x = pos.x
      players[id].y = pos.y
    } else { // new player
      players[id] = {x: pos.x, y: pos.y}
    }
  }
  // x = data
  // fill background
  context.fillStyle = 'blue';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height)

  // get camera position
  if (ownId) {
    ownPlayer = players[ownId]
  }
  var offset = centerAroundPos(ownPlayer)

  // draw world
  if (platforms) {
    context.fillStyle = 'white';
    for(var i = 0; i < platforms.length; i++) {
      var plat = platforms[i]
      context.fillRect(plat.x + offset.x, plat.y + offset.y, plat.w, plat.h);
    }
  }

  // draw players
  context.fillStyle = 'black';
  for (let [_id, pos] of Object.entries(players)) {
    context.drawImage(playerImg, pos.x + offset.x, pos.y + offset.y, 64, 64)
  }
});

function keyPress(event) {
  var key = event.key
  if(key === 'a') {
    socket.emit('move', 'left')
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

function resize() {
  context.canvas.height = document.documentElement.clientHeight
  context.canvas.width = document.documentElement.clientWidth
}

window.addEventListener('resize', resize)
resize()