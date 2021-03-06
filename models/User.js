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
    description: String,
    skills: String,
    conversationId: [{
		id: String,
		masterId: String,
		ninjaId: String,
		info: {
			lastMessage: String,
			lastUpdate: { type: Date, default: Date.now }
		}
	}],
})

module.exports = { UserSchema, User: mongoose.model('user', UserSchema) };