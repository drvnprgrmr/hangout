const socket = io("http://localhost:5500/room")

const player = JSON.parse(document.getElementById("player").textContent)
const room = JSON.parse(document.getElementById("room").textContent)

console.log(player, room)
console.log(room.master._id, player.id);
if (room.master._id === player.id) {
    socket.emit("room:create", room)
    console.log("create")
} else {
    socket.emit("room:join", player)
}

socket.on("disconnect", () => {
    if (room.master._id === player.id) {
        socket.emit("room:destroy", room._id)
    }
})