const router = require("express").Router();
const passport = require("passport");

const { registerValidation } = require("../validation/validation");

const userModel = require("../models/Users");
const bcryptjs = require("bcryptjs");

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", async(req, res) => {
    const { error } = registerValidation(req.body);

    if (error) {
        const validationERROR = error.details[0].message;
        req.flash("error_msg", validationERROR);
        res.render("users/register", {
            error: validationERROR,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword
        });
        return;
    }

    const checkEmail = await userModel.findOne({ email: req.body.email });

    if (checkEmail) {
        res.render("users/register", {
            error: "This email is already registered!",
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword
        });
        return;
    }

    try {
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(req.body.password, salt);

        const user = await userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });

        if (user) {
            req.flash("success_msg", "User registered!");
            res.redirect("/user/login");
        }
    } catch (error) {
        req.flash("error_msg", error);
    }
});

router.post("/login", async(req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/ideas",
        failureRedirect: "/user/login",
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/user/login");
});
module.exports = router;