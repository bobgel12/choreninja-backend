// Get all the module packages
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const logger = require('morgan');
const job = require('./controllers/job.js')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const passport = require('passport');
const expressSession = require('express-session');
const initPassport = require('./authentication/init');
const auth = require('./controllers/authentication')(passport);

// Connect to database
mongoose
    .connect(`mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@cluster0-uuxwd.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Create Express Server Instance
const app = express()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Configuring Passport
app.use(expressSession({ secret: 'myChoreNinjaSecretKey' }));
app.use(passport.initialize({
	resave: false,
	saveUninitialized: false
}));
app.use(passport.session());

//Initialize Passport
initPassport(passport);

app.use('/api/v1/auth', auth);
app.use('/api/v1/job', job)
app.get('/', (req, res) => {
    res.status(200).send({ msg: "Welcome to Chore Ninja", api_endpoints : "https://choreninja.herokuapp.com/api/v1/", doc_endpoints: "https://choreninja.herokuapp.com/api-docs"})
})
app.get('/secret', passport.authenticate('jwt', { session: false }) , (req, res) => {
    res.status(200).send({ msg: "Welcome to Chore Ninja secret" })
})

module.exports = app