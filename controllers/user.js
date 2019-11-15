const express = require('express');
const { User } = require('../models/User');
var router = express.Router();

router.put("/:userId", function (req, res) {
	// console.log(req.params.userId, req.body.user)
    User.findByIdAndUpdate(req.params.userId, req.body.user, {new: true}, function (err, updatedUser) {
        if (!err) {
            res.status(200).send({ "err": null, item: updatedUser })
        } else {
            res.status(500).send({ "err": err })
        }
    });
})

router.post("/conversation", function (req, res) {
	const {conversationId, masterId, ninjaId, lastMessage } = req.body
	let conObject = {
		id: conversationId,
		masterId: masterId,
		ninjaId: ninjaId,
		info: {
			lastMessage: lastMessage,
			lastUpdate: Date.now(),
		}
	}
	// console.log(conObject)
    User.findById(masterId, function (err, master) {
        if (!err) {
			// console.log(master)
			// console.log(master.conversationId)
			master.conversationId.unshift(conObject);
			// console.log(master.conversationId)
			master.save();
			User.findById(ninjaId, function (err, ninja) {
				if (!err) {
					ninja.conversationId.unshift(conObject);
					// console.log(ninja.conversationId)
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

router.put("/conversation/update", function (req, res) {
	const {conversationId, masterId, ninjaId, lastMessage } = req.body
	let conObject = {
		id: conversationId,
		masterId: masterId,
		ninjaId: ninjaId,
		info: {
			lastMessage: lastMessage,
			lastUpdate: Date.now()
		}
	}
	console.log("conObject",conObject)
    User.findById(masterId, function (err, master) {
		console.log("master", master)
        if (!err) {
			master.conversationId.splice(master.conversationId.findIndex((element) => element.id == conversationId), 1)
			master.conversationId.unshift(conObject);
			master.save();
			User.findById(ninjaId, function (err, ninja) {
				console.log("ninja", ninja)
				if (!err) {
					ninja.conversationId.splice(ninja.conversationId.findIndex((element) => element.id == conversationId), 1)
					ninja.conversationId.unshift(conObject);
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