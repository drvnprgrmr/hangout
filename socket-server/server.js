const { Server } = require("socket.io")

const PORT = 5500

const io = new Server({
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "PUT", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("connected: ", socket.id)
    socket.on("disconnect", (reason) => {
        console.log(`disconnected: ${socket.id} (${reason})`)
    })
})

const appNamespace = io.of("/app")
const joinNamespace = io.of("/join")
const roomNamespace = io.of("/room")

// Messages from the app server 
appNamespace.on("connection", (socket) => {
    console.log("app", socket.id)
    
    // Tell all waiting users about the new room
    socket.on("room:create", (room) => {
        joinNamespace.emit("room:create", room)
    })

    socket.on("player:join", (player, roomID) => {
        console.log("player:join", player, roomID)
        roomNamespace.to(roomID).emit("player:join", player)
    })
})

roomNamespace.on("connection", (socket) => {
    console.log("room", socket.id)

    socket.on("player:join", roomID => {
        socket.join(roomID)
        socket.roomID = roomID
        console.log("player join", roomID, socket.roomID)
    })
    socket.on("player:data", player => {
        console.log("player:data", player)
        socket.player = player
    })

    socket.on("room:delete", (id) => {
        // Inform users waiting to join 
        joinNamespace.emit("room:delete", id)

        // Tell the server that a room has been deleted
        appNamespace.emit("room:delete", id)

        // Remove users from room
        roomNamespace.to(id).emit("room:delete")
    })

    socket.on("disconnect", reason => {
        console.log("user left");
        roomNamespace.to(socket.roomID).emit("player:leave", socket.player._id)

        appNamespace.emit("player:leave", socket.player._id, socket.roomID)
    })
})

joinNamespace.on("connection", (socket) => {
    console.log("join", socket.id)
    
})


// Run the server
io.listen(PORT)
