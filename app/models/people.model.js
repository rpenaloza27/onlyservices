const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, document_type, users) => {
    const people = sequelize.define("people", {
        address: {
            type: DataTypes.STRING
        },
        dni: {
            type: DataTypes.STRING 
        },
        document_type: {
            type: DataTypes.INTEGER 
        },
        phone: {
            type: DataTypes.STRING 
        },
        photo: {
            type: DataTypes.STRING 
        },
        first_name: {
            type: DataTypes.STRING 
        },
        last_name: {
            type: DataTypes.STRING 
        },
        user_id: {
            type: DataTypes.INTEGER 
        },
    });
    people.hasOne(document_type);
    people.hasOne(users);
    return people;
};