const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, document_type, users, city) => {
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
        city_id: {
            type: DataTypes.INTEGER 
        },
    }, {
        timestamps: false,
    });
    people.hasOne(document_type , {
        foreignKey: 'id',
        sourceKey: 'document_type',
    });
    // people.hasOne(users, {
    //     foreignKey: 'id',
    //     sourceKey: 'user_id',
    // });
    users.hasOne(people, {
        foreignKey: 'user_id',
        sourceKey: 'id',
    });
    people.hasOne(city, {
        foreignKey: 'id',
        sourceKey: 'city_id',
    });
    return people;
};