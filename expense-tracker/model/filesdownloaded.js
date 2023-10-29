const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Download = sequelize.define('filesdownloaded', {
    url : {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = Download;