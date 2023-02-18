const express = require("express")
const roomRouter = express.Router()

const {
    getCreatePage,
    createRoom,
    getJoinPage,
    getRoom
} = require("../controllers/room.controller")


roomRouter.get("/create", getCreatePage)

roomRouter.post("/create", createRoom)

roomRouter.get("/join", getJoinPage)

roomRouter.get("/:id", getRoom)

module.exports = roomRouter