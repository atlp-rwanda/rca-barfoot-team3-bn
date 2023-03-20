const bcrypt= require("bcrypt");
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv= require("dotenv")
const User = require("../modules/user/model/index")
const dotenvConfig =require("dotenv").config()
const passport = require("passport")
const LocalStrategy= require("passport-local").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy

module.exports = function (passport){
    passport.serializeUser(function(user,done){
        done(null,user)
    });

    passport.deserializeUser(function(user,done){
        done(null,user)
    });

    passport.use(
        new FacebookStrategy(
            {
                clientID:process.env.FACEBOOK_APP_ID,
                clientSecret:process.env.FACEBOOK_APP_SECRET,
                callbackURL:process.env.FACEBOOK_APP_CALLBACK_URL,
            },
            async function (accessToken, refreshToken, profile,cb){
                const [user,status] = await User.findOrCreate({
                    where:{
                        social_user_id:profile.id,
                        name:profile.displayName,
                        registration_type:"facebook",
                    }
                });
                cb(null,user)
            }
        )
    );
    passport.use(
        new LocalStrategy(
          {
            usernameField: "email",
            passwordField: "password",
            session: true,
          },
          async function (username, password, done) {
            console.log(`trying to log in as ${username}`);
            const user = await User.findOne({ where: { email: username } });
            if (!user) {
              return done(null, false);
            }
            bcrypt.compare(password, user.password, function (err, res) {
              if (res) {
                console.log("successful login");
                return done(null, user);
              } else {
                return done(null, false);
              }
            });
          }
        )
      );
    passport.use(
        new GoogleStrategy(
            {
                clientID:process.env.GOOGLR_CLIENT_ID,
                clientSecret:process.env.GOOGLE_CLIENT_SECRET,
                callbackURL:process.env.GOOGLE_APP_CALLBACK_UR,
            },
            async function (accessToken,refreshToken,profile,cb){
                const [user, status] = await User.findOrCreate({
                    wher:{
                        social_user_id:profile.id,
                        name:profile.displayName,
                        registration_type:"google"
                    }
                });
                cb(null,user);
            }
        )
    )
}