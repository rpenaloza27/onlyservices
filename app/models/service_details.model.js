const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, user, company) => {
    const service_details = sequelize.define("service_details", {
        service_number: {
            type: DataTypes.STRING,
        },
        service_date: {
            type: DataTypes.STRING,
        },
        service_hour : {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        client_id: {
            type: DataTypes.INTEGER 
        },
        business_id: {
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
    service_details.hasOne(user, {
        foreignKey: 'id',
        sourceKey: 'client_id',
    });
    service_details.hasOne(company, {
        foreignKey: 'id',
        sourceKey: 'business_id',
    } );
    return service_details;
};