const Room = require("../models/room")
const appSocket = require("../socket")

function getCreatePage(req, res) {
    // Get the master of the room
    const master = req.session.user
    res.render("room/create", { master })
}

async function createRoom(req, res, next) {
    const { name, numPlayers, master } = req.body

    try {
        const room = await Room.create({ name, numPlayers, master })
        await room.populate("master", "-password")
        
        // Tell the socket server of the new room
        appSocket.emit("room:create", room)

        // Send the user to the newly created room
        res.redirect(room.id)
    } catch (err) {
        next(err)
    }
}

async function getJoinPage(req, res) {
    const player = req.session.user
    const rooms = await Room.find().populate("master", "-password").lean()

    res.render("room/join", { player, rooms })
}

async function getRoom(req, res) {
    const player = req.session.user
    const roomID = req.params.id
    const room = await Room.findById(roomID).populate("master", "-password")

    // If room does not exist
    if (!room) return res.send("Room does not exist")

    
    player.isMaster = player._id === room.master._id.toString()
    
    if (!player.isMaster) {
        // Tell the socket server about the new player
        appSocket.emit("player:join", player, roomID)

        // Add player to the list
        room.players.push(player._id)
        
        // Populate the room
        await room.populate("players", "-password")

        await room.save()
    }
    
    console.log("room", room)
    res.render("room/room", { player, room })
}


// Delete a room 
appSocket.on("room:delete", async (id) => {
    await Room.findByIdAndDelete(id).exec()
})

// Remove player when they leave room
appSocket.on("player:leave", async (playerID, roomID) => {
    console.log(`player ${playerID} left room ${roomID}`)
    const room = await Room.findById(roomID) 

    room.players = room.players.filter(p => !p.equals(playerID))
    
    await room.save()
    console.log("room: ", room)

})

module.exports = {
    getCreatePage,
    createRoom,
    getJoinPage,
    getRoom
}