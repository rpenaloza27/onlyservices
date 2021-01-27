const db = require("../models");
const users = db.users;
const people = db.people;
const Op = db.Sequelize.Op;
const documents_types = db.documents_types;
const cities = db.municipios;
const departments = db.departments;
const countries = db.countries
const companies = db.companies;
const services = db.services;

const user_services_favorites = db.user_services_favorites;
const { resolveUrl } = require("../services/image_url_resolver");



// Create and Save a new Tutorial
exports.create = async (req, res) => {
    try {
        const user_exists = await users.exists(req.body.user_id);
        if (user_exists) {
            const service_exists = await services.exists(req.body.service_id);
            if (service_exists) {
                user_services_favorites.findOne({
                    where: {
                        user_id: req.body.user_id,
                        service_id: req.body.service_id
                    },
                    attributes: ['user_id','service_id']
                }).then(async data => {
                    if (data == null) {
                        const obj = {
                            user_id: req.body.user_id,
                            service_id: req.body.service_id
                        }
                        user_services_favorites.create(obj)
                            .then(user_favorite => {
                                res.send({
                                    success: true,
                                    data: [user_favorite],
                                    message: "Favorito creado"
                                });
                            }).catch(e => {
                                res.status(400).send({
                                    success: false,
                                    data: [],
                                    message:
                                        e || "Some error occurred while creating the Tutorial."
                                });
                            })
                    } else {
                        user_services_favorites.destroy({
                            where: {
                                user_id: req.body.user_id,
                                service_id: req.body.service_id
                            }
                        }).then(favorite_delete => {
                            res.send({
                                success: true,
                                data : [favorite_delete],
                                message : "Favorito eliminado exitosamente"
                            })
                        }).catch(e => {
                            res.status(400).send({
                                success: false,
                                data : [],
                                message : "No se pudo eliminar el favorito"
                            })
                        });
                    }
                })
            }else{
                res.status(400).send({
                    success: false,
                    data: [],
                    message: "El servicio no existe"
                })
            }
        } else {
            res.status(400).send({
                success: false,
                data: [],
                message: "El usuario no existe"
            })
        }
    } catch (error) {
        res.status(400).send({
            success: false,
            data: [],
            message: e
        })
    }


};

exports.findByUser = async (req, res) => {
    try{
        const user_exists = await users.exists(req.params.user_id);
        if(user_exists){
            user_services_favorites.findAll({
                where : {
                    user_id : req.params.user_id
                },
                include:{ model: services ,include : { model: users, include : [{
                    model: people, include:
                        [{ model: documents_types },
                        {
                            model: cities,
                            include: [{ model: departments, include: countries }]
                        }]
                }, { model: companies }] } } 
                
            }).then(data => {
                if(data.length > 0){
                    res.send({
                        success: true,
                        data,
                        message : "Lista de favoritos"
                    })
                }else{
                    res.status(400).send({
                        success: false,
                        data : [],
                        message : "No se encontró ningún favorito"
                    })
                }
            }).catch(e => {
                res.status(400).send({
                    success: false,
                    data : [],
                    message : e
                })
            })
        }else{
            res.status(400).send({
                succes: false,
                data : [],
                message : e
            })
        }
    }catch(e){
        res.status(400).send({
            succes: false,
            data : [],
            message : e
        })
    } 
}


exports.update = (req, res) => {

};

exports.findAll = (req, res) => {


}

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

exports.findOneByFirebaseId = (req, res) => {

};

exports.updateProfileImage = (req, res) => {

}

exports.updateFirebaseIdByEmail = (req, res) => {

}

// Update a Tutorial by the id in the request


// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};