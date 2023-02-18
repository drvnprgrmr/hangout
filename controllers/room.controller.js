const Room = require("../models/room")

function getCreatePage(req, res) {
    // Get the master of the room
    const master = req.session.user
    res.render("room/create", { master })
}

async function createRoom(req, res, next) {
    const { name, numPlayers, master } = req.body

    try {
        const room = await Room.create({ name, numPlayers, master })

        // Send the user to the newly created room
        res.redirect(room.id)

    } catch (err) {
        next(err)
    }
}

function getJoinPage(req, res) {
    res.render("room/join")
}

async function getRoom(req, res) {
    const roomID = req.params.id
    const room = await Room.findById(roomID).populate("master").lean()

    res.render("room/index", { room })
}

module.exports = {
    getCreatePage,
    createRoom,
    getJoinPage,
    getRoom
}