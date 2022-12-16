/* eslint-disable */

// TODO: use es6 and polyfill with webpack

var socket = io();
var context = document.querySelector("canvas").getContext("2d");
var x = 0

var players = {}

socket.on('pos', function(newPositions) {
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

  // draw players
  context.fillStyle = "black";
  for (let [id, pos] of Object.entries(players)) {
    context.fillRect(pos.x, pos.y, 10, 10);
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