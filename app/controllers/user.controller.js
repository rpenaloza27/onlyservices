const db = require("../models");
const users = db.users;
const people = db.people;
const Op = db.Sequelize.Op;
const documents_types = db.documents_types;
const cities = db.municipios;
const departments = db.departments;
const countries = db.countries
const companies = db.companies;
const { resolveUrl } = require("../services/image_url_resolver");



// Create and Save a new Tutorial
exports.create = (req, res) => {
    users.findOne({ where: { email: req.body.email } }).then(us => {
        if (us == null) {
            const user = {
                email: req.body.email,
                password: req.body.password,
                firebase_id: req.body.firebase_id ? req.body.firebase_id :'',
                role_id: req.body.role_id,
                priority: 5
            };
            // Save user in the database
            users.create(user)
                .then(data => {
                    const person = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        city_id: req.body.city_id,
                        document_type: req.body.document_type ? req.body.document_type : 1,
                        user_id: data.id,
                        phone: req.body.phone ? req.body.phone : '',
                        dni: req.body.dni ? req.body.dni : '',
                        profession: req.body.profession ? req.body.profession : ''
                    }
                    people.create(person)
                        .then(data2 => {
                            if (req.body.role_id == 2) {
                                const company = {
                                    name: req.body.business_name,
                                    nit: req.body.nit,
                                    url: req.body.url ? req.body.url : '',
                                    user_id: req.body.firebase_id
                                }
                                companies.create(company).then(co => {
                                    res.send({
                                        success: true,
                                        data: [{
                                            user: data,
                                            person: data2,
                                            company: co
                                        }],
                                        message: "Usuario creado exitosamente"
                                    });
                                }).catch(e => {
                                    res.status(400).send({
                                        success: false,
                                        data: [],
                                        message: "No se pudo crear la empresa"
                                    });
                                })
                            } else {
                                res.send({
                                    success: true,
                                    data: [{
                                        user: data,
                                        person: data2
                                    }],
                                    message: "Usuario creado exitosamente"
                                });
                            }

                        });
                })
                .catch(err => {
                    res.status(400).send({
                        success: false,
                        data: [],
                        message:
                            err.message || "Some error occurred while creating the Tutorial."
                    });
                });
        } else {
            res.status(400).send({
                success: false,
                data: [],
                message: "El email ya está registrado"
            })
        }
    }).catch(e => {
        res.status(400).send({
            success: false,
            data: [],
            message:
                e
        });
    })

};

exports.findAll = (req, res) => {
    people.
        findAll()
        .then(data => {
            if (data.length > 0) {
                res.send({
                    success: true,
                    data,
                    message: "Usuario encontrado"
                });
            } else {
                res.status(400).send({
                    success: false,
                    data,
                    message: "Usuario  no encontrado"
                });
            }
        });
}

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    if (req.params.user_id) {
        //
        users.findOne({
            where: { id: req.params.user_id }, include:
                [{
                    model: people, include:
                        [{ model: documents_types },
                        {
                            model: cities,
                            include: [{ model: departments, include: countries }]
                        }]
                }, { model: companies }]
        })
            .then(data => {
                if (data != null) {
                    res.send({
                        success: true,
                        data,
                        message: "Usuario encontrado"
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        data: [],
                        message: "Usuario no encontrado"
                    });
                }
            }).catch(e => {
                console.log("Error", e)
                res.status(400).send({
                    success: false,
                    data: [],
                    message: e
                });
            });
    } else {
        res.staus(400).send({
            success: false,
            data: [],
            message: "El id de usuario es requerido"
        });
    }
};

exports.findOneByFirebaseId = (req, res) => {
    if (req.params.user_id) {
        //
        users.findOne({
            where: { firebase_id: req.params.user_id }, include:
                [{ model: people, include: [{ model: documents_types }, { model: cities, include: [{ model: departments, include: countries }] }] }]
        })
            .then(data => {
                if (data != null) {
                    res.send({
                        success: true,
                        data,
                        message: "Usuario encontrado"
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        data: [],
                        message: "Usuario no encontrado"
                    });
                }
            }).catch(e => {
                console.log("Error", e)
                res.status(400).send({
                    success: false,
                    data: [],
                    message: e
                });
            });
    } else {
        res.staus(400).send({
            success: false,
            data: [],
            message: "El id de usuario es requerido"
        });
    }
};

exports.updateProfileImage = (req, res) => {
    if (req.file) {
        users.findOne({where : {
            firebase_id : req.body.user_id
        }}).then(user => {
            if(user != null){
                people.update(
                    { photo: resolveUrl(req.file.filename) },
                    { where: { user_id : user.id } }
                  )
                    .then(result =>
                        res.send({
                            success: true,
                            data: [],
                            message: "Imagen de Perfil Actualizada"
                        })
                    )
                    .catch(err =>
                        res.status(400).send({
                            success: false,
                            data: [],
                            message: err
                        })
                    )
            }else{
                res.status(400).send({
                    success: false,
                    data: [],
                    message: "El usuario no existe"
                })
            }
        })
       
        
    }
}

exports.updateFirebaseIdByEmail = (req, res) => {
    if(req.body.email && req.body.firebase_id){
        users.update(
            { firebase_id: req.body.firebase_id },
            { where: { email : req.body.email } }
        ).then(data => {
            res.send({
                success : true,
                data,
                message: "Id actualizado"
            })
        }).catch(e => {
            res.status(400).send({
                success : false,
                data: [],
                message: e
            })
        })
    }else{
        if(!req.body.email){
            res.status(400).send({
                success : false,
                data: [],
                message: "El email es requerido"
            })
            return;
        }
        if(!req.body.firebase_id){
            res.status(400).send({
                success : false,
                data: [],
                message: "El id es requerido"
            })
            return;
        }
        
    }
}

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};