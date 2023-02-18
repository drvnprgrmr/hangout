require("dotenv").config()

const httpServer = require("./app")
const connectDB = require("./connect-db")
require("./socket-server")

const port = process.env.PORT || 3000

// Start the server
httpServer.listen(port, () => {
    console.log("Server is running on http://localhost:" + port)

    // Connect to database
    connectDB()
})
