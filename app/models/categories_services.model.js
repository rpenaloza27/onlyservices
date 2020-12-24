const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const categories_services = sequelize.define("categories_services", {
        service_id: {
            type: DataTypes.INTEGER
        },
        category_id: {
            type: DataTypes.STRING 
        },
        status: {
            type: DataTypes.INTEGER 
        },
        
    }, {
        timestamps: false,
    });
    
    return categories_services;
};