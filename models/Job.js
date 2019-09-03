const mongoose = require('mongoose')
const { UserSchema } = require('./User')

const JobSchema = new mongoose.Schema({
    name: String,
    price: Number,
    post_date: { type: Date, default: Date.now },
    due_date: { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 },
    end_date: { type: Date, default: Date.now },
    description: String,
    master: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    ninja: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = { JobSchema, Job: mongoose.model("job", JobSchema) };