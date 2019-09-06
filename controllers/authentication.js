var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    //if the user is authenticated in the session, call the next() to call the request handler
    if(req.isAuthenticated()) 
        return next();
    //if user not authenticated then redirect him to login page.
    res.redirect('/');
}

module.exports = function(passport){
    
    //Get login page
    // router.get('/', function(req,res){
    //     // res.render('index', {message: "Hello from auth"});
    //     res.status(200).send({ message: "Hello from auth" });
    // });
    
    //Handle login page
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/home',
        failureRedirect: '/auth/failure',
    }));

    // //Get registration page
    router.get('/signup', function(req, res)
    {
        res.status(200).send({ message: "Hello from signup" });
    });

    //Handle registration post
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/aftersignup',
        failureRedirect: '/auth/failure',
    }));

    //get homepage
    router.get('/home', isAuthenticated, function(req, res){
        res.status(200).send({ message: "Successfully login" , user: req.user});
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
        res.status(200).send({ message: "Failure accur" });
    })

    return router;
}