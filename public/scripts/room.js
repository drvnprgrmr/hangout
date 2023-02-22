const socket = io("http://localhost:5500/room")

const roomID = document.getElementById("room-id")
const deleteBtn = document.getElementById("delete")

deleteBtn.addEventListener("click", () => {
    const msg = `
    Are you sure you want to delete this room?
    All users will be automatically removed
    `
    const resp = confirm(msg)
    if (resp) {
        socket.emit("room:delete", roomID)
        
        // Redirect back to the home URL
        location.href = "/"
    }
})

