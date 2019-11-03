// var Post = import('../models/Job')
const { Job } = require('../models/Job');
// Middleware
var middleware = [];

middleware.isThisYourPost = function (req, res, next){
	Job.findById(req.params.jobId, function(err, foundJob){
		if (err) res.status(500).send({"err": String(err)})
		if (!foundJob) res.status(300).send({"err": "No job found"})
		if (foundJob.master.id.equals(req.user._id)) {
			next();
		} else{
			res.status(401).send({"err": "Not your post!"})
		}
	})
}

module.exports = middleware;