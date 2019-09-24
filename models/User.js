const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    uid: String,
    email: String,
    phone_number: String,
    is_ninja: {type: Boolean, default: false},
    username: String,
    password: String,
})

module.exports = { UserSchema, User: mongoose.model('user', UserSchema) };