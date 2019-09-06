var login = require('./login');
var signup = require('./signup');
var { User } = require('../models/User');

module.exports = function(passport){
    //Serialize and Deserialize to keep the user credentials private
    passport.serializeUser(function (user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done){
        User.findById(id, function(err, user){
            console.log('deserializing user: ', user);
            done(err, user);
        });
    });

    login(passport);
    signup(passport);

}