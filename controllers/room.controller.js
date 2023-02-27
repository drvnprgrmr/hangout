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
    const room = await Room.findById(roomID).populate("master", "-password").lean()

    res.render("room/room", { player, room })
}


// Delete a room 
appSocket.on("room:delete", async (id) => {
    console.log(`room ${id} has been deleted`)
    await Room.findByIdAndDelete(id).exec()
})

module.exports = {
    getCreatePage,
    createRoom,
    getJoinPage,
    getRoom
}