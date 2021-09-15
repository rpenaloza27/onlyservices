const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, services) => {
    const payment_types = sequelize.define("payment_types", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            
        },
        name: {
            type: DataTypes.STRING
        },

        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1 
        },

    }, {
        timestamps: false,
    });
    
    services.hasOne(payment_types, {
        foreignKey: 'id',
        sourceKey: 'payment_type',
        as: 'Payment_Type', //
    });
    return payment_types;
};