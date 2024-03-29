const { Schema, model } = require("mongoose")


const roomSchema = new Schema({
    name: String,
    master: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    numPlayers: {
        type: Number,
        min: 3
    },

    players: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]

})


const Room = model("Room", roomSchema)


module.exports = Room