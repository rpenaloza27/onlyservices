const { DataTypes } = require("sequelize");
// const { categories } = require(".");

module.exports = (sequelize, Sequelize,services,municipios) => {
    const services_cities = sequelize.define("services_cities", {
        service_id: {
            type: DataTypes.INTEGER,
        },
        city_id: {
            type: DataTypes.INTEGER 
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    }, {
        timestamps: false,
    });

    services.hasMany(services_cities,
        {
            foreignKey: 'service_id',
            sourceKey: 'id'
    });
    services_cities.hasOne(municipios, {
        foreignKey: 'id',
        sourceKey: 'city_id'
    })

    
    // categories.belongsTo(categories,  {foreignKey: 'parent_id', targetKey: 'id'});
    
    return services_cities;
};