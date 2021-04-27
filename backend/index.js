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
const { Passport } = require("passport");
// const s3 = require("./s3")
// const ReactDom = require('react-dom');
// const ReactS3 = require('react-s3')
require('dotenv').config(); // Loading dotenv to have access to env variables
const fileUpload = require('express-fileupload')




const app = express();

// Importing AWSPresigner
const {
    generateGetUrl,
    generatePutUrl
} = require('./AWSPresigner')



mongoose.connect("mongodb+srv://jackr353:jackr353@project-3-cluster-jack.w6g2v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log("Mongoose Is Connected!")
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(
    cors({
    origin: "http://localhost:3000" || "http://localhost:4000", // <-- location of the react app
    credentials: true
}))
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true
}))

app.use(cookieParser("secretcode"))
// initialize passport and passport session
app.use(passport.initialize());
app.use(passport.session());
// require this file and pass passport as a param
require('./passportConfig')(passport);

// app.use(express.json());
// app.use(cors());

// END OF MIDDLEWARE ^



// ----- Routes -----

// UPLOAD IMAGE ROUTES
app.get('/s3Url', async (req, res) => {
    const url = await generateUploadURL()
    res.send({url})
  });

const AWS = require('aws-sdk');
const fs = require('fs')
console.log(process.env.AWS_ACCESS_KEY_ID);

var s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
});

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}))

app.post("/api/assets/upload", (req, res) => {

    console.log("UPLOADBODY", req.files)


    // need to know where these files are coming from
    const file = fs.readFile(req.files.image.tempFilePath, function(err, data) {
        var params = {
            Key: req.files.image.name,
            Bucket: process.env.BUCKET_NAME,
            Body: data,
            ACL: 'public-read'
        };

        s3.putObject(params, function put(err, data) {
            if (err) {
                console.log("PUT ERROR", err, err.stack);
                return;
            } else {
                console.log("PUT SUCESS");
            }
            delete params.Body;
        }); 
    })
})


// 
// })

app.listen(4000, () => {
    console.log("SERVER HAS STARTED!");
})



// 6-minute upload to react video
// const config = {
//     bucketName: process.env.BUCKET_NAME,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'us-east-2'
// }

// GET URL
app.get('/generate-get-url', (req, res) => {
    // Both Key and ContentType are defined in the client side.
    // Key refers to the remote name of the file.
    const { Key } = req.query;
    generateGetUrl(Key)
      .then(getURL => {      
        res.send(getURL);
      })
      .catch(err => {
        res.send(err);
      });
  });  

// // PUT URL
// app.get('/generate-put-url', (req,res)=>{
//     // Both Key and ContentType are defined in the client side.
//     // Key refers to the remote name of the file.
//     // ContentType refers to the MIME content type, in this case image/jpeg
//     const { Key, ContentType } =  req.query;
//     generatePutUrl(Key, ContentType).then(putURL => {
//       res.send({putURL});
//     })
//     .catch(err => {
//       res.send(err);
//     });
//   });


// // LOGIN ROUTES
// app.post('/login', (req, res, next) => {
//     console.log(req.body);
//     passport.authenticate("local", (err, user, info) => {
//         if (err) throw err;
//         if (!user) res.send("No User Exists");
//         else {
//             req.logIn(user, err => {
//                 if (err) throw err;
//                 res.send("Successfully Authenticated!!");
//                 console.log(req.user);
//             })
//         }
//     })(req, res, next);
// });
// app.post('/register', (req, res) => {
//     console.log(req.body);
//     User.findOne({username: req.body.username}, async (err, doc) => {
//         if (err) throw err;
//         if (doc) res.send("USER ALREADY EXISTS");
//         if (!doc) {
//             const hashedPassword = await bcrypt.hash(req.body.password, 10);
//             const newUser = new User({
//                 username: req.body.username,
//                 password: hashedPassword,
//             });
//             await newUser.save();
//             res.send("User Created!");
//         }
//     })
// });
// app.get('/user', (req, res) => { //once authenticated, the User is Stored in the req.user
//     // the req object you get from the client now has a user object inside of it
//     // the object contains all of the session data
//     // the object can be used and called at anytime, anywehere in the app
//     res.send()