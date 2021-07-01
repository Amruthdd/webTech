const sequelize = require("../util/database");
const questiontable = require("../models/questiontable");
const user = require("../models/user")
const answertable = require("../models/answertable")
const votestoretable = require('../models/votestore');

exports.answersofq =  (req, res, next) => {
    answertable.findAll({
            where: {
                questiontableQuestionid: req.params.questionid
            },
            include: [
                user
        ],
         order: [
                          ['votes', 'DESC'],
                         
                        ],
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
            res.status(200).json({
                result: result
            });
            
        })
        .catch((err) => {
            next(err);
        })
}

exports.addvotes = (req, res, next) => {
    votestoretable.findAll({ where: { voter: req.body.email,answertableAnswerid: req.body.id } })
        .then(async(user) => {
            if (user.length == 0) {
                try {
                    const vote = await votestoretable.create({ voter: req.body.email, answertableAnswerid: req.body.id });
                    const answer = await answertable.findByPk(req.body.id);
                   await  answer.increment('votes')
                        
                    return res.sendStatus(200);
                } catch (err) {
                    next(err);
                }
            }
              
            else {
                const error =new Error('u already voted');
                error.statusCode = 403;
                throw error;
            }
           
        })
     .catch ((err) =>{
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
                ansobject.id = e.dataValues.answerid
                ansobject.answer = e.dataValues.answer;
                ansobject.votes = e.dataValues.votes;


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

exports.deleteanswer = (req, res, next) => {

     answertable.destroy({
            where: {
                answerid: req.body.answerid
            }
        })
        .then((r) => {
            res.sendStatus(200);

        })
        .catch((err) => {
            next(err);
        })
}

exports.updateanswer = (req, res, next) => {
    
     answertable.findByPk(req.body.answeridid)
        .then((q) => {
            q.update({
                    answer: req.body.answer,
                    
                })
                .then(r => {
                   
                    res.sendStatus(200)
                })
                .catch((err) => {
                    next(err);
                })
        })

}
