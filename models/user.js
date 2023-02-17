const bcrypt = require("bcrypt")
const { Schema, model } = require("mongoose")


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
})

userSchema.pre("save", async function(next) {
    // Hash password
    this.password = await bcrypt.hash(this.password, 10)
    
    next()
})


userSchema.methods.validatePassword = async function(password) {
    // Check if password is valid
    const isValid = await bcrypt.compare(password, this.password)
    return isValid
}

const User = model("User", userSchema)

module.exports = User