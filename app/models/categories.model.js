const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const categories = sequelize.define("categories", {
        name: {
            type: DataTypes.STRING,
        },
        icon: {
            type: DataTypes.INTEGER 
        },
        parent_id: {
            type: DataTypes.INTEGER 
        },
        status: {
            type: DataTypes.INTEGER 
        },
    }, {
        timestamps: false,
    });
    
    return categories;
};