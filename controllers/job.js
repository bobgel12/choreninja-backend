const express = require('express');
const { Job } = require('../models/job');
var router = express.Router();

router.get("/", function (req, res) {
    Job.find().then(jobs => res.send(jobs))
})

router.post("/", function (req, res) {
    Job.create(req.body.job, (err, job) => {
        if (!err){
            // job.master.id = req.user._id;
            // job.master.username = req.user.username;
            job.save()
            res.status(200).send({ "err": null, item: job})
        } else{
            res.status(500).send({"err": err})
        }
    })
})

router.put("/:jobId", function (req, res) {
    Job.findByIdAndUpdate(req.params.jobId, req.body.job, function (err, updatedJob) {
        if (!err) {
            res.status(200).send({ "err": null, item: updatedJob })
        } else {
            res.status(500).send({ "err": err })
        }
    });
})
    
router.delete("/:jobId", function (req, res) {
    Job.findByIdAndRemove(req.params.jobId, function (err) {
        if (!err) {
            res.status(200).send({ "err": null, item: "Successfully delete the job" })
        } else {
            res.status(500).send({ "err": err })
        }
    });
})
    
module.exports = router;