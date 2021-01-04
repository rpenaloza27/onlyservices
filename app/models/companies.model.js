const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, users) => {
    const companies = sequelize.define("companies", {
        name: {
            type: DataTypes.STRING,
        },
        url: {
            type: DataTypes.STRING 
        },
        user_id: {
            type: DataTypes.STRING 
        },
        status: {
            type: DataTypes.INTEGER 
        },
    },  {
        timestamps: false,
    });
    companies.hasOne(users,  {
        foreignKey: 'firebase_id',
        sourceKey: 'user_id',
    });
    return companies;
};