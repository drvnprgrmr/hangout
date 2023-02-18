const express = require("express")
const authRouter = express.Router()

const {
    getSignupPage, 
    signupUser,
    getSigninPage,
    signinUser
} = require("../controllers/auth.controller")



authRouter.get("/signup", getSignupPage)
authRouter.post("/signup", signupUser)

authRouter.get("/signin", getSigninPage)
authRouter.post("/signin", signinUser)


module.exports = authRouter