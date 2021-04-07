const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

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
});
app.get('/user', (req, res) => {})

app.listen(4000, () => {
    console.log("server has started!");
})