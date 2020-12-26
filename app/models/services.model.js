const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, users, details, images, comments) => {
    const services = sequelize.define("services", {
        name: {
            type: DataTypes.STRING,
        },
        short_description: {
            type: DataTypes.STRING,
        },
        long_description: {
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.INTEGER 
        },
        status: {
            type: DataTypes.INTEGER 
        },
    }, {
        timestamps: false,
    });
    services.hasOne(users,  {
        foreignKey: 'firebase_id',
        sourceKey: 'user_id',
    });
    services.hasMany(details);
    services.hasMany(images);
    services.hasMany(comments);
    return services;
};