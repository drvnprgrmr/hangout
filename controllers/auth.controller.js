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
    const { username, password, remember } = req.body

    const user = await User.findOne({ username }).exec()

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
        _id: user.id,
        username: user.username
    }

    if (remember) {
        // Set the cookie to expire in 30 days
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000

        // Save remember state to session
        req.session.remember = true
    } else {
        // Set the cookie to expire in 1 day
        req.session.cookie.maxAge = 24 * 60 * 60 * 1000
    }

    res.redirect("/")


}

async function signoutUser(req, res, next) {
    const cookie = req.session.cookie
    
    // Delete the session
    req.session.destroy(err => {
        if (err) return next(err)

        // Clear the cookie
        res.clearCookie("connect.sid", {...cookie})

        // Redirect to the login page
        res.redirect("/auth/signin")
    })
}

module.exports = {
    getSignupPage,
    signupUser,
    getSigninPage,
    signinUser,
    signoutUser
}
