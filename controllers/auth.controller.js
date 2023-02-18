const User = require("../models/user")


function getSignupPage(req, res) {
    res.render("auth/signup")
}

async function signupUser(req, res, next) {
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


}

function getSigninPage(req, res) {
    res.render("auth/signin")
}


async function signinUser(req, res) {
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


}


module.exports = {
    getSignupPage,
    signupUser,
    getSigninPage,
    signinUser
}