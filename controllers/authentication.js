var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

module.exports = function(passport){
	router.get("/google", passport.authenticate("google"));

	router.get(
	  "/google/callback",
	  passport.authenticate("google", {
	    successRedirect: "/api/v1/auth/aftersignup",
	    failureRedirect: "/api/v1/auth/failure"
	  })
	);

    //Handle login page
    router.post('/signin', function (req, res, next) {
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
				// generate a signed son web token with the contents of user object and return it in the response
				console.log(user)
                const token = jwt.sign({_id: user._id}, 'choreninjastaff');
                return res.json({ user, token });
            });
        })(req, res);
	});

    // //Get registration page
    router.get('/signup', function(req, res)
    {
        res.status(200).send({ message: "Hello from signup" });
    });

    //Handle registration post
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/api/v1/auth/aftersignup',
        failureRedirect: '/api/v1/auth/failure',
    }));

    //get loggedin
    router.get('/getLoggedIn', passport.authenticate('jwt', { session: false }), function(req, res){
		User.findById(req.user._id, function(err, user){
			if (err) res.status(500).send(null)
			else res.status(200).send({user});
        });
    });

    //get homepage
    router.get('/aftersignup', function(req, res){
        res.status(200).send({ message: "Thanks for signup" });
    });

    //Handle Logout
    router.get('/signout', function(req, res){
        req.logout();
        res.redirect('/');
    })

    //Handle Logout
    router.get('/failure', function(req, res){
        res.status(500).send({ message: "Failure to login" });
    })

    return router;
}