const express = require('express');
const { User } = require('../models/User');
var router = express.Router();

router.put("/:userId", function (req, res) {
	console.log(req.params.userId, req.body.user)
    User.findByIdAndUpdate(req.params.userId, req.body.user, {new: true}, function (err, updatedUser) {
        if (!err) {
            res.status(200).send({ "err": null, item: updatedUser })
        } else {
            res.status(500).send({ "err": err })
        }
    });
})
    
module.exports = router;