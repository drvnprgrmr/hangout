require("dotenv").config()

const app = require("./app")
const connectDB = require("./connect-db")

const port = process.env.PORT || 3000

// Start the server
app.listen(port, () => {
    console.log("Server is running on http://localhost:" + port)

    // Connect to database
    connectDB()
})
