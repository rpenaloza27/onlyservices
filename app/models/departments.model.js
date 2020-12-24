const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, countries) => {
    const departamentos = sequelize.define("departamentos", {
        name: {
            type: DataTypes.STRING,
        },
        country_id: {
            type: DataTypes.INTEGER 
        },
    }, {
        timestamps: false,
    });
    departamentos.hasOne(countries, {
        foreignKey: 'id',
        sourceKey: 'country_id',
    })

    return departamentos;
};