/* eslint-disable */

// TODO: use es6 and polyfill with webpack

var socket = io();
var context = document.querySelector("canvas").getContext("2d");
var x = 0
socket.on('pos', function(data) {
  console.log(data)
  x = data
  context.fillStyle = "white";
  context.fillRect(0, 0, 400, 250);
  context.fillStyle = "black";
  context.fillRect(x,0,250,120);
});