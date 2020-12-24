const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, users) => {
    const service_comments = sequelize.define("service_comments", {
        comment: {
            type: DataTypes.STRING,
        },
        qualification: {
            type: DataTypes.INTEGER 
        },
        user_id: {
            type: DataTypes.INTEGER 
        },
        service_id: {
            type: DataTypes.INTEGER 
        },
        status: {
            type: DataTypes.INTEGER 
        },
    },  {
        timestamps: false,
    });
    service_comments.hasOne(users, {
        foreignKey: 'id',
        sourceKey: 'user_id',
    })
    return service_comments;
};