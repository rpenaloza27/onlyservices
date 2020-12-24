const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, roles) => {
    const users = sequelize.define("users", {
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING 
        },
        firebase_id: {
            type: DataTypes.STRING 
        },
        priority: {
            type: DataTypes.INTEGER 
        },
        role_id: {
            type: DataTypes.INTEGER 
        },
        status: {
            type: DataTypes.INTEGER 
        },
    });
    users.hasMany(roles);
    return users;
};