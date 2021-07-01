const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const votestoretable = sequelize.define('votestoretable',{
    
    votersid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    voter: {
        type: Sequelize.STRING,
        allowNull:false
    }
    
});

module.exports=votestoretable;