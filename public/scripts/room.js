const socket = io("http://localhost:5500/room")

const roomID = document.getElementById("room-id").textContent
const deleteBtn = document.getElementById("delete")
const playerList = document.getElementById("player-list")

socket.emit("player:join", roomID)

if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
        const msg = `
        Are you sure you want to delete this room?
        All users will be automatically removed
        `
        const willDelete = confirm(msg)
        if (willDelete) {
            socket.emit("room:delete", roomID)
            
            // Redirect back to the home URL
            location.href = "/"
        }
    })
}

socket.on("player:join", player => {
    const playerEl = document.createElement("li")
    playerEl.className = "player"
    playerEl.textContent = player.username
    playerEl.id = player._id

    playerList.append(playerEl)

    socket.emit("player:data", player)
    console.log("player", player)
})

socket.on("player:leave", id => {
    // Remove player when they leave
    const playerEl = document.getElementById(id)
    playerEl.remove()
})

socket.on("room:delete", () => {
    alert("The master has deleted this room")
    // Redirect the user to the join page
    location.href = "/room/join"
})

