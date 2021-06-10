const sequelize = require("../util/database");
const questiontable = require("../models/questiontable");
const user = require("../models/user")
const answertable = require("../models/answertable")


exports.answersofq =  (req, res, next) => {
    answertable.findAll({
            where: {
                questiontableQuestionid: req.params.questionid
            },
            include: [
                user
            ]
        })
        .then((r) => {
            const result = []
            r.map((e) => {
                var obj = new Object();
                obj.answerid = e.dataValues.answerid;
                obj.answer = e.dataValues.answer;
                obj.votes = e.dataValues.votes;
                obj.answereduser = e.dataValues.user.fullname;
                result.push(obj);
            })
            res.send(200).json({
                result: result
            });
            console.log(result);
        })
        .catch((err) => {
            next(err);
        })
}

exports.addvotes =  (req, res, next) => {
    answertable.findByPk(req.params.answerid)
        .then((answer) => {
            answer.votes += 1;

        })
        .catch((err) => {
            next(err);
        })
}

exports.answerofuser =  (req, res, next) => {
    // console.log(req.params.email);

    answertable.create({
            answer: req.body.answer,
            userEmail: req.body.email,
            questiontableQuestionid: req.body.questionid
        })
        .then((r) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            next(err)
        })


}

exports.answeractivity =  (req, res, next) => {
    // console.log(req.params.email);


    answertable.findAll({
            where: {
                userEmail: req.params.email
            },
            include: [
                questiontable
            ]
        })
        .then((r) => {
            const result = [];
            r.map((e) => {
                var ansobject = new Object();
                ansobject.question = e.dataValues.questiontable.question;

                ansobject.category = e.dataValues.questiontable.category;

                ansobject.answer = e.dataValues.answer;
                ansobject.votes = e.dataValues.votes;


                result.push(ansobject);
            })
            console.log(result);
            res.status(200).json({
                result: result
            });

        })
        .catch((err) => {
            next(err)
        })


}