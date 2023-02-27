require("dotenv").config()

const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")

const authRouter = require("./routes/auth.router")
const roomsRouter = require("./routes/room.router")

const app = express()

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
    resave: false,
    secure: process.env.NODE_ENV === 'development' ? false : true
}))

// Middleware to protect routes
const loggedIn = (req, res, next) => {
    if (req.session.user) return next()
    res.redirect("/auth/signin")
}

app.get("/", (req, res) => {
    const user = req.session.user 
    res.render("index", { user })
})

// Routes
app.use("/auth", authRouter)
app.use("/room", loggedIn, roomsRouter)

// 404 Handler
app.use((req, res) => {
    res.status(404).send(`Not found. \nYou tried accessing ${req.url}`)
})

// Error handler
app.use((err, req, res, next) => {
    res.status(500).send(err.toString())
})


module.exports = app


