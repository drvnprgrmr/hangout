const socket = io("http://localhost:5500/room")

const roomID = document.getElementById("room-id").textContent
const deleteBtn = document.getElementById("delete")

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


