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

router.post("/conversation", function (req, res) {
	const {conversationId, masterId, ninjaId} = req.body
    User.findById(masterId, function (err, master) {
        if (!err) {
			master.conversationId.push(conversationId);
			master.save();
			User.findById(ninjaId, function (err, ninja) {
				if (!err) {
					ninja.conversationId.push(conversationId);
					ninja.save();
					res.status(200).send({ "err": null })
				} else {
					res.status(500).send({ "err": err })
				}
			});
        } else {
			res.status(500).send({ "err": err })
        }
    });
})
    
module.exports = router;