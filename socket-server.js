const httpServer = require("./app")

const { Server } = require("socket.io")

const io = new Server(httpServer)

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id)
})


