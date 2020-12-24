const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const service_images = sequelize.define("service_images", {
        url: {
            type: DataTypes.STRING,
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
    
    return service_images;
};