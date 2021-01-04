const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, users) => {
    const companies = sequelize.define("companies", {
        name: {
            type: DataTypes.STRING,
        },
        url: {
            type: DataTypes.STRING 
        },
        nit: {
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
    companies.belongsTo(users,  {foreignKey: 'user_id', targetKey: 'firebase_id'});
    users.hasOne(companies, {
        foreignKey: 'user_id',
        sourceKey: 'firebase_id'
    })
    return companies;
};