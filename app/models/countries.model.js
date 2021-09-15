const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const countries = sequelize.define("countries", {
        name: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.INTEGER
        },
    }, {
        timestamps: false,
    });
    return countries;
};