require("dotenv").config({ path: "./config/config.env" });

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const passport = require("passport");

var MemoryStore = require("session-memory-store")(session);

// here the passport part come
require("./config/passport")(passport);

// for the handlebars errors
const {
    allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access");

const DBCONFIG = require("./config/db.js");

// database connection here
DBCONFIG();

// handlebars middleware here
app.engine(
    "handlebars",
    exphbs({
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    })
);
app.set("view engine", "handlebars");

// middleware for the body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// making the static folder here
app.use(express.static(path.join(__dirname, "static")));

// using the session middleware here for saving the state of login user :)
app.use(
    // generate the secret key random for more secure
    session({
        secret: process.env.SESSION_SECRET,
        // resave if nothing is change
        resave: false,
        // save empty value?
        saveUninitialized: false,
        store: new MemoryStore(10)
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash messaging here
app.use(flash());

// global messages here
app.use(function(req, res, next) {
    // res.locals.messages = require("express-messages")(req, res);
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

app.get("/", (req, res) => {
    res.render("index");
});

// ideas routes here
app.use("/ideas", require("./routes/ideas"));

// users routes here
app.use("/user", require("./routes/users"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Started on PORT = ${PORT}`));