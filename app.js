// Get all the module packages
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const logger = require('morgan');
const job = require('./controllers/job.js')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

// Connect to database
let db = require('./config/default.json')
mongoose
    .connect(db.mongoURI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Create Express Server Instance
const app = express()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Here is the API route
app.use('/api/v1/job', job)

module.exports = app