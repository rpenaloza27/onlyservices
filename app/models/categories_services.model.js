const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, services, categories) => {
    const categories_services = sequelize.define("categories_services", {
        service_id: {
            type: DataTypes.INTEGER,

        },
        category_id: {
            type: DataTypes.STRING
        },

        status: {
            type: DataTypes.INTEGER
        },

    }, {
        timestamps: false,
    });
    /**
     * {
        foreignKey: 'id',
        sourceKey: 'role_id',
    }
     */
    categories_services.hasOne(services,
        {
            foreignKey: 'id',
            sourceKey: 'service_id',
        });

    categories_services.hasOne(categories, {
        foreignKey: 'id',
        sourceKey: 'category_id',
    });
    // services.belongsToMany(categories, { through: categories_services });
    // categories.belongsToMany(services, { through: categories_services, });
    return categories_services;
};