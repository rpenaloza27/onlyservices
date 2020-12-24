const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, departamentos) => {
    const municipios = sequelize.define("municipios", {
        name: {
            type: DataTypes.STRING,
        },
        departamento_id: {
            type: DataTypes.INTEGER 
        },
    }, {
        timestamps: false,
    });
    municipios.hasOne(departamentos, {
        foreignKey: 'id',
        sourceKey: 'departamento_id',
    })
    return municipios;
};