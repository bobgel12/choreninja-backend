var LocalStrategy = require('passport-local').Strategy;
// var User = require('../models/User');
var { User } = require('../models/User');
var bCrypt = require('bcrypt-nodejs');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
module.exports = function(passport){
    passport.use('login', new LocalStrategy({
        passReqtoCallback: true
        },
        function (username, password, callback) {
            //Check in mongo if a user with username exists or not
            User.findOne({ 'username': username }, (err, user) => {
                    //In case of any error, return using the done method
                    if (err)
                        return callback(err);

                    //If user does not exist, log error & redirect back
                    if (!user) {
                        console.log('User Not Found with username ' + username);
                        return callback(null, false, { message: `User Not Found with username ${username}` });
                    }
                    //If user exist but wrong password, log the error
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return callback(null, false, { message: `Invalid Password` });
                    }
                    //If user and password match, return user from done method (success)
                    console.log(user)
                    return callback(null, user, { message: `Succesfully login` });
                }
            );
        })
    );

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), 
        secretOrKey: 'choreninjastaff'
    }, (jwtPayload, cb) => {
            //find the user in db if needed
            return User.findOne({ 'username': jwtPayload.username })
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    ));
    
    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }

}