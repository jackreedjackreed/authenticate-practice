const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passsport");
const passportLocal = require("passport-local");
const cookiePasrser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: "http://localhost: 3000" // <-- location of the react app
    credentials: true
}))
app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser("keyboard cat"))

app.listen(4000, () => {
    console.log("server has started!");
}