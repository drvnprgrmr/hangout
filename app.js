require("dotenv").config()

const http = require("http")
const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")

const authRouter = require("./routes/auth.router")
const roomsRouter = require("./routes/room.router")

const app = express()
const httpServer = http.createServer(app)

app.set("view engine", "ejs")
app.set("views", "views")

app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))


app.get("/", (req, res) => {
    const user = req.session.user 
    
    res.render("index", { user })
})

// Routes
app.use("/auth", authRouter)
app.use("/room", roomsRouter)

// 404 Handler
app.use((req, res) => {
    res.status(404).send(`Not found. \nYou tried accessing ${req.url}`)
})

// Error handler
app.use((err, req, res, next) => {
    res.status(500).send(err.toString())
})


module.exports = httpServer


