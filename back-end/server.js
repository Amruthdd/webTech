const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const Cors = require("cors");
const sequelize = require("./util/database");
const user = require("./models/user");
const questiontable = require("./models/questiontable");
const answertable = require("./models/answertable");
const app = express();
const bcrypt = require("bcrypt");
const multer = require('multer');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const questioncontroller = require('./controllers/question')
const answercontroller = require("./controllers/answer")
require("dotenv").config();


user.hasMany(questiontable);
questiontable.belongsTo(user, {
    constraints: true
});
user.hasMany(answertable);
answertable.belongsTo(user, {
    constraints: true
});
questiontable.hasMany(answertable);
answertable.belongsTo(questiontable, {
    constraints: true,
    onDelete: 'CASCADE'
});


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {

        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }

}
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/dp', multer({
    storage: filestorage,
    fileFilter: fileFilter
}).single('data'));

app.use(
    Cors({
        origin: ["http://localhost:3000"],

        methods: ["GET", "POST", "PUT", "DELETE"],

        credentials: true,
    })
);

app.use(cookieParser());
app.use(
    session({
        key: "username",
        secret: "appu703453",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

app.use(express.json());

const verifyJWT = (req, res, next) => {
    // const token = req.headers["x-access-token"];
    const token = req.get("x-access-token");

    if (!token) {
        res.send("NO TOKEN FOUND!!");
    } else {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.json({
                    auth: false,
                    message: "Failed to Auth"
                });
            } else {
                req.id = decoded.id;
                next();
            }
        });
    }
};





app.post("/signup", async (req, res, next) => {
    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    user.create({

            email: req.body.email,

            fullname: req.body.fullname,
            password: hash,
            department: req.body.department,

        })
        .then((r) => {

            const username = user.fullname;
            const token = jwt.sign({
                username
            }, process.env.SECRET, {
                expiresIn: 7200,
            });
            res.status(200).json({
                message: "signup succesfull",
                auth: true,
                token: token,
            });
        })
        .catch((err) => {

            err.statusCode = 403;
            err.message = "email already registered!! choose another";
            res.send(err.message);
            next(err);
        });
});


app.post("/login", (req, res) => {
    user.findByPk(req.body.email)
        .then((user) => {
            if (user) {
                bcrypt.compare(
                    req.body.password,
                    user.password,
                    (err, response) => {
                        if (response) {
                            req.session.user = user;

                            const username = user.fullname;
                            const token = jwt.sign({
                                    username
                                },
                                process.env.SECRET, {
                                    expiresIn: 7200,
                                }
                            );
                            // console.log(req.session.user);
                            res.status(200).json({
                                auth: true,
                                token: token
                            });
                        } else {
                            res.json({
                                auth: false,
                                message: "wrong combinations!!",
                            });
                        }
                    }
                );
            } else {
                //    res.status(404).send({message:"No user found!!"});
                res.json({
                    auth: false,
                    message: "No user found!!"
                });
            }
        })
        .catch((err) => console.log(err));
});

app.get("/:email/user", verifyJWT, (req, res, next) => {
    console.log(req.params.email);
    user.findByPk(req.params.email)
        .then((user) => {
            res.status(200).json({

                email: user.email,
                department: user.department,
                fullname: user.fullname,
                image: user.image,
                joined:user.createdAt
            });
        })
        .catch((err) => {

            console.log(err);
        });
});

app.post("/dp/:email", verifyJWT, (req, res, next) => {


    user.findByPk(req.params.email)
        .then((user) => {
            console.log(user);
            const p = user.image;
            console.log(req.file);
            user.update({
                    image: req.file.path
                })
                .then(r => {
                    res.status(200).json({
                        path: req.file.path
                    });
                    if (p) {
                        fs.unlink(p, function (err) {
                            if (err) throw err;
                            console.log('file deleted');
                        })
                    }


                }).catch(err => {
                    err.statusCode = 500;
                    err.message = "error occured";
                    next(err);
                });

        })
        .catch((err) => {
            next(err);
        })

})



app.get("/explore/questions", verifyJWT, questioncontroller.exploreallquestions)



app.get("/question", verifyJWT, questioncontroller.getquestionhome);

app.get("/answer/:questionid", verifyJWT, answercontroller.answersofq)

app.post("/votes/:answerid", verifyJWT,answercontroller.addvotes)
app.post("/question/user", verifyJWT, questioncontroller.createquestion);
app.put("/question/user", verifyJWT, questioncontroller.updatequestion)

app.delete("/question/user", verifyJWT, questioncontroller.deletequestion)


app.post("/answer/user", verifyJWT,answercontroller.answerofuser);

app.get("/question/:email", verifyJWT, questioncontroller.getquestionuser);

app.get("/activityanswer/:email", verifyJWT,answercontroller.answeractivity);
app.get("/category/:c", verifyJWT, questioncontroller.getquestionbycategory)




app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).send();
    console.log(status);
});



sequelize
    .sync()
    .then((r) => {
        // console.log(r);
        app.listen(process.env.PORT || 8001);
    })
    .catch((err) => console.log(err));