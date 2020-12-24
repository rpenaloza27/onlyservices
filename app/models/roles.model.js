const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const roles = sequelize.define("roles", {
        name: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER 
        }
    });

    return roles;
};