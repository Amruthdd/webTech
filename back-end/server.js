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
const votestoretable = require("./models/votestore");
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
questiontable.hasMany(answertable,
    { onDelete: 'cascade' });
answertable.belongsTo(questiontable, {
    foreignKeyConstraint:true,
   
    
});
answertable.hasMany(votestoretable,
    { onDelete: 'cascade' });
votestoretable.belongsTo(answertable, {
    constraints: true,
   
})



app.use(express.json());

app.use(
    Cors({
        origin: ["http://localhost:3000"],

        methods: ["GET", "POST", "PUT", "DELETE"],

        credentials: true,
    })
);





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
var upload = multer({
    storage: filestorage,
    fileFilter: fileFilter
})
// app.use('/dp', multer({
//     storage: filestorage,
//     fileFilter: fileFilter
// }).single('data'));

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

            const username = r.fullname;
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
app.post("/dp/:email",upload.single('data'), (req, res, next) => {

   
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

app.get("/:email/user", verifyJWT, (req, res, next) => {
    console.log(req.params.email);
    user.findByPk(req.params.email)
        .then((user) => {
            res.status(200).json({

                email: user.email,
                department: user.department,
                fullname: user.fullname,
                image: user.image,
                bio: user.bio,
                location:user.location,
                gradYear:user.gradYear
            });
        })
        .catch((err) => {

            console.log(err);
        });
});



app.post('/user/update', verifyJWT, (req, res, next) => {
    user.findByPk(req.body.email)
        .then((user) => {
            user.update({
                fullname: req.body.fullname,
                bio: req.body.bio,
                location: req.body.location,
                department: req.body.department,
                gradYear:req.body.graduationYear
            })
                .then((r) => {
                    res.sendStatus(200);
                })
                .catch((err) => {
                    next(err);
            })
        })
        .catch((err) => {
            next(err);
    })
})


app.get("/explore/questions", verifyJWT, questioncontroller.exploreallquestions)



app.get("/question", verifyJWT, questioncontroller.getquestionhome);

app.get("/answer/:questionid", verifyJWT, answercontroller.answersofq)

app.post("/votes/user", verifyJWT,answercontroller.addvotes)
app.post("/question/user", verifyJWT, questioncontroller.createquestion);
app.put("/question/user", verifyJWT, questioncontroller.updatequestion)

app.delete("/question/user", verifyJWT, questioncontroller.deletequestion)


app.post("/answer/user", verifyJWT,answercontroller.answerofuser);

app.get("/question/:email", verifyJWT, questioncontroller.getquestionuser);

app.get("/activityanswer/:email", verifyJWT,answercontroller.answeractivity);
app.get("/category/:c", verifyJWT, questioncontroller.getquestionbycategory)
app.put("/answer/user", verifyJWT, answercontroller.updateanswer)

app.delete("/answer/user", verifyJWT, answercontroller.deleteanswer)
app.get("/related/:category/:id", verifyJWT, questioncontroller.relatedquestion)



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