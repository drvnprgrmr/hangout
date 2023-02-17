const express = require("express")
const User = require("../models/user")

const authRouter = express.Router()

authRouter.get("/signup", (req, res) => {
    res.render("auth/signup")
})

authRouter.post("/signup", async (req, res, next) => {
    const { username, password } = req.body

    try {
        const user = await User.create({ username, password })
        // Save user info to the session
        req.session.user = {
            id: user.id,
            username: user.username
        }
        res.redirect("/")
    } catch (err) {
        next(err)
    }


})

authRouter.get("/signin", (req, res) => {
    res.render("auth/signin")
})

authRouter.post("/signin", async (req, res, next) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    let error
    if (!user) {
        error = new Error("User does not exist")
        error.status = 404
    } else if (!user.validatePassword(password)) {
        error = new Error("Password is invalid")
        error.status = 400
    }

    if (error) {
        return res.status(error.status).json(error)
    }

    // Save user info to the session
    req.session.user = {
        id: user.id,
        username: user.username
    }

    res.redirect("/")


})

module.exports = authRouter