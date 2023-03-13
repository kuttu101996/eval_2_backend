const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type:String,
        require: true,
        default: "customer",
        enum: ["customer", "seller"]
    }
})

const User = mongoose.model("user", userSchema)


module.exports = {
    User
}