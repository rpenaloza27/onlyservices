const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, services, person) => {
    const user_services_favorites = sequelize.define("user_services_favorites", {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        service_id : {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    }, {
        timestamps: false,
    });
    user_services_favorites.hasMany(services,  {
        foreignKey: 'id',
        sourceKey: 'service_id',
    });
    services.hasMany(user_services_favorites, {
        foreignKey: 'service_id',
        sourceKey: 'id',
    });
    
    return user_services_favorites;
};