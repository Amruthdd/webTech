const sequelize = require("../util/database");
const questiontable = require("../models/questiontable");
const user = require("../models/user")
const answertable = require("../models/answertable")
const Sequelize = require('sequelize');
const promise1 = (r) => {
    return new Promise(async (resolve, reject) => {

        let questions = await Promise.all(
            r.map(async (e) => {
                return answertable
                    .findAll({
                       
                        where: {
                            questiontableQuestionid: e.dataValues.questionid
                        },
                        include: [
                            user
                        ],
                        order: [
                            ['votes','DESC']
                        ]
                    })
                    .then((r) => {
                       
                        var qaobject = new Object();
                        qaobject.question = e.dataValues.question;
                        qaobject.questionid = e.dataValues.questionid;
                        qaobject.category = e.dataValues.category;
                        qaobject.user = e.dataValues.user.fullname;
                        if (r[0]) {
                        qaobject.answer = r[0].dataValues.answer;
                        qaobject.answervotes = r[0].dataValues.votes;
                        qaobject.answereduser = r[0].dataValues.user;
                        } else {
                        qaobject.answer = null;
                        qaobject.answervotes = null;
                        qaobject.answereduser = null;
                        }
                        


                        return qaobject
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
        )
        // console.log(questions)


        resolve(questions);

    });
};


exports.getquestionhome = async (req, res, next) => {
    questiontable
        .findAll({
            include: [
                user
            ]
        })
        .then((r) => {
            promise1(r)
                .then(function (value) {
                    value.reverse();
                    res.status(200).json({
                        questions: value
                    });
                })
                .catch((err) => {
                    console.log(err);
                    next(err);
                });
        })
        .catch((err) => {
            next(err);
        });
}


exports.deletequestion = (req, res, next) => {

    questiontable.destroy({
            where: {
                questionid: req.body.questionid
            }
        })
        .then((r) => {
            res.sendStatus(200);

        })
        .catch((err) => {
            next(err);
        })
}

exports.updatequestion = (req, res, next) => {
    
    questiontable.findByPk(req.body.questionid)
        .then((q) => {
            q.update({
                    question: req.body.question,
                    category: req.body.category
                })
                .then(r => {
                   
                    res.sendStatus(200)
                })
                .catch((err) => {
                    next(err);
                })
        })

}


exports.createquestion = (req, res, next) => {
    // console.log(req.params.email);
    // console.log(req.body.question);
    questiontable.create({
            question: req.body.question,
            category: req.body.category,
            userEmail: req.body.email
        })
        .then((r) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            next(err)
        })


}

exports.getquestionuser = (req, res, next) => {
    // console.log(req.params.email);


    questiontable.findAll({
            where: {
                userEmail: req.params.email
            }
        })
        .then((r) => {
            const result = [];
            r.map((e) => {

                var ansobject = new Object();
                ansobject.question = e.dataValues.question;
                ansobject.questionid = e.dataValues.questionid;
                ansobject.category = e.dataValues.category;


                result.push(ansobject);
            })
            
            res.status(200).json({
                result: result
            });

        })
        .catch((err) => {
            next(err)
        })


}
exports.getquestionbycategory = (req, res, next) => {
    questiontable.findAll({
            where: {
                category: req.params.c
            }
        }).then((r) => {
            const result = [];
            r.map((e) => {
                var ob = new Object();
                ob.question = e.dataValues.question;
                ob.questionid = e.dataValues.questionid;
                ob.category = e.dataValues.category;
                result.push(ob);
            })

            res.status(200).json({
                result: result
            });
        })
        .catch((err) => {
            next(err);
        })
}


exports.exploreallquestions = (req, res, next) => {
    questiontable
        .findAll({
            include: [
                user
            ]
        })
        .then((r) => {
            const result = []
            r.map((e) => {
                var qaobject = new Object();
                qaobject.question = e.dataValues.question;
                qaobject.questionid = e.dataValues.questionid;
                qaobject.category = e.dataValues.category;
                qaobject.user = e.dataValues.user.fullname;
                result.push(qaobject);
            })
            res.status(200).json({
                result: result
            });
        })
        .catch((err) => {
            next(err);
        });

}

exports.relatedquestion = (req, res, next) => {
    questiontable.findAll({
        where: { category: req.params.category },
        order: Sequelize.literal('rand()'), limit: 10 
        
    })
        .then((q) => {
           
        res.json({relatedquestions:q})
    })
        .catch((err) => {
        next(err)
    })
}
