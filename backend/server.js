const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./user");
const app = express();

mongoose.connect("mongodb+srv://jackr353:jackr353@project-3-cluster-jack.w6g2v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log("Mongoose Is Connected!")
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: "http://localhost: 3000", // <-- location of the react app
    credentials: true
}))
app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser("keyboard cat"))


// Routes
app.post('/login', (req, res) => {
    console.log(req.body);
});
app.post('/register', (req, res) => {
    console.log(req.body);
    User.findOne({username: req.body.username}, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send("USER ALREADY EXISTS");
        if (!doc) {
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
            });
            await newUser.save();
            res.send("User Created!");
        }
    })
});
app.get('/user', (req, res) => {})

app.listen(4000, () => {
    console.log("SERVER HAS STARTED!");
})