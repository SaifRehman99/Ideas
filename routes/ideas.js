const router = require("express").Router();
const Ideas = require("../models/Ideas");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("ideas/addIdea");
});

router.get("/", ensureAuthenticated, (req, res) => {
    Ideas.find({ user: req.user.id })
        .sort({ date: "desc" })
        .then(idea => {
            res.render("ideas/viewIdea", {
                idea
            });
        })
        .catch(err => res.send(err));
});

router.post("/", ensureAuthenticated, async(req, res) => {
    // making errors here
    const error = [];

    if (!req.body.title) {
        error.push({ text: "Please Enter title frist!" });
    }

    if (!req.body.details) {
        error.push({ text: "Please Enter details frist!" });
    }

    if (error.length > 0) {
        res.render("ideas/addIdea", {
            errors: error,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        try {
            const ideas = await Ideas.create({
                title: req.body.title,
                details: req.body.details,
                user: req.user.id
            });
            req.flash("success_msg", "Idea Added");
            res.redirect("/ideas");
        } catch (error) {
            req.flash("error_msg", "Idea Adding failed");
            res.send(error);
        }
    }
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Ideas.findOne({ _id: req.params.id })
        .then(idea => {
            if (idea.user === req.user.id) {
                res.render("ideas/editIdea", {
                    idea
                });
            } else {
                req.flash("error_msg", "Not Authorized!");
                res.redirect("/ideas");
                return;
            }
        })
        .catch(err => {
            res.send(err);
        });
});

router.post("/edit/:id", ensureAuthenticated, (req, res) => {
    Ideas.updateOne({ _id: req.params.id }, req.body)
        .then(idea => {
            req.flash("success_msg", "Idea Updated");
            res.redirect("/ideas");
        })
        .catch(err => {
            req.flash("error_msg", "Idea Updating Failed");
            res.send(err);
        });
});

router.delete("/:id", ensureAuthenticated, (req, res) => {
    Ideas.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash("success_msg", "Idea Deleted");
            res.redirect("/");
        })
        .catch(err => {
            req.flash("error_msg", "Idea delete Failed");
            res.send(err);
        });
});

module.exports = router;