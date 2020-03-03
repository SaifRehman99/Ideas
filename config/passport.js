const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const userModel = require("../models/Users");

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: "email" },
            async(email, password, done) => {
                // matching the user here
                const checkEmail = await userModel.findOne({ email: email });

                if (!checkEmail) {
                    return done(null, false, { message: "That email is not registered" });
                }

                // comapring the password here
                const revertPassword = await bcrypt.compare(
                    password,
                    checkEmail.password
                );
                if (!revertPassword) {
                    return done(null, false, { message: "Password incorrect" });
                } else {
                    return done(null, checkEmail, { message: "You are now login!" });
                }
            }
        )
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        userModel.findById(id, function(err, user) {
            done(err, user);
        });
    });
};