const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const categories = sequelize.define("categories", {
        name: {
            type: DataTypes.STRING,
        },
        icon: {
            type: DataTypes.STRING 
        },
        parent_id: {
            type: DataTypes.INTEGER 
        },
        status: {
            type: DataTypes.INTEGER 
        },
    }, {
        timestamps: false,
    });

    categories.hasMany(categories, {
        as: 'subcategories',
        foreignKey: 'parent_id',
        sourceKey: 'id',
        useJunctionTable: false
    })
    // categories.belongsTo(categories,  {foreignKey: 'parent_id', targetKey: 'id'});
    
    return categories;
};