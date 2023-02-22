const { io } = require("socket.io-client")

const appSocket = io("http://localhost:5500/app")

module.exports = appSocket