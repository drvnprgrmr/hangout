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

        console.log(room)
    })
})

roomNamespace.on("connection", (socket) => {
    console.log("room", socket.id)
    

    socket.on("room:delete", (id) => {
        // Inform users waiting to join 
        joinNamespace.emit("room:delete", id)

        // Tell the server that a room has been deleted
        appNamespace.emit("room:delete", id)
    })
})

joinNamespace.on("connection", (socket) => {
    console.log("join", socket.id)
    
})


// Run the server
io.listen(PORT)
