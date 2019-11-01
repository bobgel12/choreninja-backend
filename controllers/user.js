const express = require('express');
const { User } = require('./models/User');
var router = express.Router();

router.post("/", function (req, res) {
    User.create(req.body.job, (err, job) => {
        if (!err){
            job.save()
            res.status(200).send({ "err": null, item: job})
        } else{
            res.status(500).send({"err": err})
        }
    })
})

router.put("/:userId", function (req, res) {
    User.findByIdAndUpdate(req.params.userId, req.body.user, function (err, updatedUser) {
        if (!err) {
            res.status(200).send({ "err": null, item: updatedUser })
        } else {
            res.status(500).send({ "err": err })
        }
    });
})
    
module.exports = router;