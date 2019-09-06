 var LocalStrategy = require('passport-local').Strategy;
 var { User } = require('../models/User');
 var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport)
{
    passport.use('signup', new LocalStrategy({
        passReqtoCallback: true
    },
        function (username, password, done) {
            findOrCreateUser = function () {
                User.findOne({ 'username': username }, function (err, user) {
                    
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    //if user is in the database, notify user
                    if (user) {
                        console.log('User already exists');
                        return done(null, false);
                    }
                    else {
                        var newUser = new User();

                        newUser.username = username;
                        newUser.password = hash(password);
                        newUser.email = req.body.email;
                        newUser.first_name = req.body.first_name;
                        newUser.last_name = req.body.last_name;
                        newUser.phone_number = req.body.phone_number;
                        newUser.is_ninja = req.body.is_ninja;

                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration Successful');
                            return done(null, newUser);
                        });
                    }
                });
            };

            process.nextTick(findOrCreateUser);
        })
    );

    var hash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}