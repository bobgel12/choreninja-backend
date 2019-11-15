const mongoose = require('mongoose')
const { UserSchema } = require('./User')

const JobSchema = new mongoose.Schema({
    name: String,
    zipcode: String,
    price: Number,
    start_date: { type: Date, default: Date.now},
    end_date: { type: Date },
    post_date: { type: Date, default: Date.now },
    due_date: { type: Date, default: Date.now() + 7 * 24 * 60 * 60 * 1000 },
    description: String,
    master: {
				id: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User"
					},
				username: String
			},
    ninja: {
				id: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User"
					},
				username: String
	}
})

module.exports = { JobSchema, Job: mongoose.model("job", JobSchema) };