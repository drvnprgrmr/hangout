const express = require("express")
const roomRouter = express.Router()

const Room = require("../models/room")



roomRouter.get("/create", (req, res) => {
    // Get the master of the room
    const master = req.session.user
    res.render("room/create", { master })
})

roomRouter.post("/create", async (req, res, next) => {
    const { name, numPlayers, master } = req.body
    
    try {
        const room = await Room.create({ name, numPlayers, master })
        
        // Save room data
        res.locals.room = room
        res.locals.master = req.session.user
        
        // Send the user to the newly created room
        res.redirect(room.id)

    } catch (err) {
        next(err)
    }
    
})

roomRouter.get("/:id", async (req, res) => {
    const roomID = req.params.id
    const room = await Room.findById(roomID).populate("master").lean()

    res.render("room/index", { room })
})

module.exports = roomRouter