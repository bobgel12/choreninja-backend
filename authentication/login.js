var LocalStrategy = require('passport-local').Strategy;
// var User = require('../models/User');
var { User } = require('../models/User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
    passport.use('login', new LocalStrategy({
        passReqtoCallback: true
        },
        function (username, password, done) {
            //Check in mongo if a user with username exists or not
            User.findOne({ 'username': username },
                function (err, user) {
                    //In case of any error, return using the done method
                    if (err)
                        return done(err);

                    //If user does not exist, log error & redirect back
                    if (!user) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false);
                    }
                    //If user exist but wrong password, log the error
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false);
                    }
                    //If user and password match, return user from done method (success)
                    return done(null, user);
                }
            );
        })
    );
    
    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }

}