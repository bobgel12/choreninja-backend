const express = require('express');
const { User } = require('./models/User');
var router = express.Router();

router.get("/", function(req, res) {
	res.send("User route")
})


module.exports = router;