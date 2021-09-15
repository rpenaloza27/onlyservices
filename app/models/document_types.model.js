const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const documents_types = sequelize.define("documents_types", {
        name: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER 
        }
    }, {
        timestamps: false,
    });

    return documents_types;
};