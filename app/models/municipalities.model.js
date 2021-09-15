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
    departamentos.hasMany(municipios, 
        {as: 'municipalities', constraints: false, allowNull:true, 
        defaultValue:null,foreignKey: 'departamento_id',
        sourceKey: 'id',});
    return municipios;
};