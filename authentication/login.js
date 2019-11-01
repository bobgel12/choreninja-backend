var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var { User } = require('../models/User');
var bCrypt = require('bcrypt-nodejs');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
let googleConfig = {}
if (process.env.GOOGLE_CLIENT_ID){
	googleConfig = {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL,
		scope: ["email","profile", "openid"]
	}
} else{
	Config = require('../authentication/social/socialapp.json')
	googleConfig = {
		clientID: Config['google']['app_id'],
		clientSecret: Config['google']['app_secret'],
		callbackURL: Config['google']['callback'],
		scope: ["email","profile", "openid"]
	 }
}

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

	  passport.use(
		new GoogleStrategy(googleConfig,
		  function(accessToken, refreshToken, profile, done) {
			const { _json } = profile;
			const { email, given_name, family_name } = _json;
			User.findOne({ 'username': email }, function (err, user) {
				console.log(err)
				if (err) return callback(err);
				if (user) {
					console.log('User already exists');
				}else {
					var newUser = new User();

					newUser.username = email;
					newUser.email = email;
					newUser.first_name = given_name;
					newUser.last_name = family_name;
					newUser.save(function (err) {
						if (err) {
							console.log('Error in Saving user: ' + err);
							throw err;
						}
						console.log('User Registration Successful');
					});
				}
				console.log(user, newUser)
				done(null, user || newUser);
			});
		  }
		)
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