const socket = io("http://localhost:5500/join")

const username = document.getElementById("username")
const playerID = document.getElementById("player-id")

const roomList = document.getElementById("room-list")

socket.user = {
    username, playerID
}

socket.emit("player:enter")

// When new room is created
socket.on("room:create", (room) => {
    console.log("New room: ", room)
    const roomEl = document.createElement("li")
    roomEl.className = "room"
    roomEl.id = room._id
    roomEl.innerHTML = `
        <a href="${room._id}">
            <span class="room-name">${room.name}</span>
            <span class="num-players">${room.numPlayers}</span>
            <span class="status">Active</span>
        </a>
    `
    roomList.appendChild(roomEl)
})