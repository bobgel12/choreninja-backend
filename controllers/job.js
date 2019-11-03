const express = require('express');
const { Job } = require('../models/Job');
const { User } = require('../models/User');
const middleware = require('../middleware');
const passport = require('passport');
var router = express.Router();
router.get("/",  passport.authenticate('jwt', { session: false }), function (req, res) {
	const { master_id , ninja_id, ninja } = req.query
	let mongoQuery = {}
	if (ninja){
		mongoQuery["ninja"] = null
	}
	if (master_id){
		mongoQuery["master.id"] = master_id
	}
	if (ninja_id){
		mongoQuery["ninja.id"] = ninja_id
	}
	
    Job.find(mongoQuery).sort({post_date:-1}).then(jobs => res.status(200).send(jobs))
})

router.post("/", passport.authenticate('jwt', { session: false }), function (req, res) {
	console.log(req.user)
	User.findById(req.user._id, (err, user)=>{
		if (err) res.status(401).send({"err": "Not authorized, Please login"})
		else{
			console.log(user)
			newJob = req.body.job
			newJob.master = {
				id: user._id,
				username: user.username
			}
			Job.create(newJob, (err, job) => {
				if (!err){
					job.save()
					res.status(200).send({ "err": null, item: job})
				} else{
					res.status(500).send({"err": err})
				}
			})
		}
	})
})

router.put("/:jobId", passport.authenticate('jwt', { session: false }) ,function (req, res) {
	Job.findByIdAndUpdate(req.params.jobId, req.body.job, function (err, updatedJob) {
		if (!err) {
			res.status(200).send({ "err": null, item: updatedJob })
        } else {
            res.status(500).send({ "err": err })
        }
    });
})
    
router.delete("/:jobId", passport.authenticate('jwt', { session: false }), function (req, res) {
    Job.findByIdAndRemove(req.params.jobId, function (err) {
        if (!err) {
            res.status(200).send({ "err": null, item: "Successfully delete the job" })
        } else {
            res.status(500).send({ "err": err })
        }
    });
})
    
module.exports = router;