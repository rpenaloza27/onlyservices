const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize, users, details, images, comments,people) => {
    const services = sequelize.define("serviceses", {
        name: {
            type: DataTypes.STRING,
        },
        short_description: {
            type: DataTypes.STRING,
        },
        long_description: {
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.STRING 
        },
        price: {
            type: DataTypes.INTEGER 
        },
        number_of_visits : {
            type: DataTypes.INTEGER
        },
        qualification : {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.INTEGER 
        },
    }, {
        timestamps: false,
    });
    services.hasOne(users,  {
        foreignKey: 'firebase_id',
        sourceKey: 'user_id',
    });
    services.hasMany(details);
    services.hasMany(images,  {
        foreignKey: 'service_id',
        sourceKey: 'id',
    });
    images.belongsTo(services, {
        foreignKey: 'service_id',
        sourceKey: 'id',
    });
    services.hasMany(comments,  {
        foreignKey: 'service_id',
        sourceKey: 'id',
    });
    
    services.exists = async (id) => {
        try{
            const service_exist = await services.findOne({
                where : {
                    id : id
                }
            });
            return service_exist != null;
        }catch(e){
            return false;
        }
    }
    services.findOneCustom = async (id) => {
        try{
            
            const service_exist = await services.findOne({
                where : {
                    id : id
                },
                include: [{ model: images, paranoid: false }, { model: users, include: people }]
            });
            return service_exist;
        }catch(e){
            return null;
        }
    }

    services.getQualification = (comments)=>{
        if(comments){
            let qualification=0;
            if(comments.length>0){
                comments.forEach(c=> {
                    qualification+= c.qualification? c.qualification:0
                })
                let rate= qualification/comments.length;
                return rate;
            }
            return qualification;
        }
        return 0;
    }

    services.getComments = async (service_id) =>{
        const service_comments=await comments.findAll({
            where:{
                service_id
            }
        });
        return service_comments;
    }
    return services;
};