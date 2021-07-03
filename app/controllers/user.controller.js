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
const {verified, sendEmail} = require("../services/mailer.service")
const { response } = require("../services/response.service");
const enviroment = require("../../environment/enviroment");
const fs = require("fs");
const mailerConfig = require("../../config/mail.config");



// Create and Save a new Tutorial
exports.create = (req, res) => {
    users.findOne({ where: { email: req.body.email } }).then(us => {
        if (us == null) {
            const user = {
                email: req.body.email,
                password: req.body.password,
                firebase_id: req.body.firebase_id ? req.body.firebase_id : '',
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
                        profession: req.body.profession ? req.body.profession : '',
                        genre: req.body.genre ? req.body.genre : '',
                    }
                    people.create(person)
                        .then(data2 => {
                            if (req.body.role_id == 2) {
                                const company = {
                                    name: req.body.business_name,
                                    nit: req.body.nit,
                                    url: req.body.url ? req.body.url : '',
                                    size: req.body.size ? req.body.size : '',
                                    user_id: data.id
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

exports.userExist = async (req, res) => {
    const user_exists = await users.exists(req.params.firebase_id);
    res.send({
        succes: true,
        data: [user_exists],
        message: "Prueba"
    })
}


exports.update = (req, res) => {
    if (req.params.user_id) {
        users.findOne({ where: { firebase_id: req.params.user_id } }).then(data => {
            if (data != null) {
                users.update({
                    email: req.body.email,
                    password: req.body.password,
                    role_id: req.body.role_id,
                    priority: req.body.priority
                },
                    { where: { id: data.id } }
                ).then(user => {
                    people.update({
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        city_id: req.body.city_id,
                        document_type: req.body.document_type ? req.body.document_type : 1,
                        phone: req.body.phone ? req.body.phone : '',
                        dni: req.body.dni ? req.body.dni : '',
                        profession: req.body.profession ? req.body.profession : '',
                        genre: req.body.genre ? req.body.genre : '',
                        address: req.body.address ? req.body.address : '',
                    }, { where: { user_id: data.id } })
                        .then(person => {
                            if (req.body.role_id == 2) {
                                const company = {
                                    name: req.body.business_name,
                                    nit: req.body.nit,
                                    url: req.body.url ? req.body.url : '',
                                    size: req.body.size ? req.body.size : '',
                                }
                                companies.update(company, { where: { user_id: data.id } }).then(co => {
                                    res.send({
                                        success: true,
                                        data: [{
                                            user: data,
                                            person: person,
                                            company: co
                                        }],
                                        message: "Usuario actualizado exitosamente"
                                    });
                                }).catch(e => {
                                    res.status(400).send({
                                        success: false,
                                        data: [{
                                            user: data,
                                            person: person,
                                        }],
                                        message: "Se actualizó el usuario, la persona pero no la empresa"
                                    });
                                })
                            } else {
                                res.send({
                                    success: true,
                                    data: [{
                                        user: data,
                                        person: person,
                                    }],
                                    message: "Usuario actualizado exitosamente"
                                });
                            }
                        })
                        .catch(e => {
                            res.send({
                                success: false,
                                data: [{
                                    user: data,
                                }],
                                message: "Se actualizó el usuario pero no la persona"
                            });
                        })
                })
                    .catch(e => {
                        res.send({
                            success: false,
                            data: [{
                                user: data,
                            }],
                            message: "No se pudo actulaizar el usuario"
                        });
                    })
            } else {
                res.status(400).send({
                    success: false,
                    data: [],
                    message: "Usuario no encontrado"
                })
            }
        })
    } else {
        res.status(400).send({
            success: false,
            data: [],
            message: "El id es requerido"
        })
        return;
    }
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

exports.findAllBusiness = (req, res) => {
    users.findAll({
        where: {
            role_id: 2,
            priority: { [Op.in]: [1, 2, 3] }
        },
        order: [
            // will return `name`
            ['priority', 'ASC'],
        ],
        include:
            [{
                model: people, include:
                    [{ model: documents_types },
                    {
                        model: cities,
                        include: [{ model: departments, include: countries }]
                    }]
            }, { model: companies }]
    }).then(data => {
        let options = {}
        if (data.length > 0) {
            options = {
                data,

            }
        } else {
            options = {
                error: true
            }
        }
        options.message = options.error ? "No hay empresas destacadas" : "Lista de empresas destacadas"
        response(res, options)
    })
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
                console.warn("Data", data)
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
                [{
                    model: people,
                    include: [{ model: documents_types }, { model: cities, include: [{ model: departments, include: countries }] },]
                },
                { model: companies }
                ]
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
        users.findOne({
            where: {
                firebase_id: req.body.user_id
            }
        }).then(async user => {
            if (user != null) {
                const person = await people.findOne(
                    { where: { user_id: user.id } }
                );
                if (person) {
                    try {
                        if (person.photo) {
                            const env_path = enviroment.production ? enviroment.URL : enviroment.URL_LOCAL;
                            const url = `public/${person.photo.replace(env_path, "")}`;
                            fs.unlink(url, async function (err) {
                                if (err) {
                                    res.status(400).send({
                                        success: false,
                                        data: [{ url, image_url: person.photo }],
                                        message: "No se encontró la ruta del archivo " + err
                                    })
                                    return console.log(err);
                                }
                                try {
                                    person.photo = resolveUrl(req.file.filename)
                                    await person.save();
                                    res.send({
                                        success: true,
                                        data: [],
                                        message: "Imagen Eliminada"
                                    })
                                } catch (e) {
                                    res.status(400).send({
                                        success: false,
                                        data: [],
                                        message: "No se pudo actualizar"
                                    })
                                }

                                console.log('file deleted successfully');
                            });
                        } else {
                            try {
                                person.photo = resolveUrl(req.file.filename)
                                await person.save();
                                res.send({
                                    success: true,
                                    data: [],
                                    message: "Imagen de Perfil Actualizada"
                                })
                            } catch (e) {
                                res.status(400).send({
                                    success: false,
                                    data: [],
                                    message: "No se pudo actualizar la imagen de perfil" +e 
                                })
                            }
                        }
                    } catch (e) {
                        res.status(400).send({
                            success: false,
                            data: [],
                            message: "Error" + e
                        })
                    }

                }
                people.update(
                    { photo: resolveUrl(req.file.filename) },
                    { where: { user_id: user.id } }
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
            } else {
                res.status(400).send({
                    success: false,
                    data: [],
                    message: "El usuario no existe"
                })
            }
        })


    }else {
        console.log("FIle", req.file)
        res.status(400).send({
            status: true,
            file:req.file,
            body:req.body
        })

    }
}

exports.deleteProfileImage=(req,res)=>{
    users.findOne({
        where: {
            firebase_id: req.body.user_id
        }
    }).then(async user => {
        if (user != null) {
            const person = await people.findOne(
                { where: { user_id: user.id } }
            );
            if (person) {
                try {
                    if (person.photo) {
                        const env_path = enviroment.production ? enviroment.URL : enviroment.URL_LOCAL;
                        const url = `public/${person.photo.replace(env_path, "")}`;
                        fs.unlink(url, async function (err) {
                            if (err) {
                                res.status(400).send({
                                    success: false,
                                    data: [{ url, image_url: person.photo }],
                                    message: "No se encontró la ruta del archivo " + err
                                })
                                return console.log(err);
                            }
                            try {
                                person.photo = null;
                                await person.save();
                                res.send({
                                    success: true,
                                    data: [],
                                    message: "Imagen Eliminada"
                                })
                            } catch (e) {
                                res.status(400).send({
                                    success: false,
                                    data: [],
                                    message: "No se pudo actualizar"
                                })
                            }

                            console.log('file deleted successfully');
                        });
                        return;
                    } else {
                        try {
                            person.photo = null
                            await person.save();
                            res.send({
                                success: true,
                                data: [{photo:person.photo}],
                                message: "Imagen eliminada"
                            })
                        } catch (e) {
                            res.status(400).send({
                                success: false,
                                data: [{photo:person.photo}],
                                message: "No se pudo actualizar la imagen de perfil" +e 
                            })
                        }
                    }
                } catch (e) {
                    res.status(400).send({
                        success: false,
                        data: [],
                        message: "Error" + e
                    })
                }

            }
            res.status(400).send({
                success: false,
                data: [],
                message: "La persona no existe"
            })
        } else {
            res.status(400).send({
                success: false,
                data: [],
                message: "El usuario no existe"
            })
        }
    })
}

exports.updateFirebaseIdByEmail = (req, res) => {
    if (req.body.email && req.body.firebase_id) {
        users.update(
            { firebase_id: req.body.firebase_id },
            { where: { email: req.body.email } }
        ).then(data => {
            res.send({
                success: true,
                data,
                message: "Id actualizado"
            })
        }).catch(e => {
            res.status(400).send({
                success: false,
                data: [],
                message: e
            })
        })
    } else {
        if (!req.body.email) {
            res.status(400).send({
                success: false,
                data: [],
                message: "El email es requerido"
            })
            return;
        }
        if (!req.body.firebase_id) {
            res.status(400).send({
                success: false,
                data: [],
                message: "El id es requerido"
            })
            return;
        }

    }
}

// Update a Tutorial by the id in the request


// Delete a Tutorial with the specified id in the request
exports.verifiedOrUnverifiedUser = async (req, res) => {
    const user_exists = await users.findOneCustom(req.params.firebase_id);
    try{
        console.log("User ", user_exists)
        console.log("Body ", req.params)
        if(user_exists){
            const verifiedUser= user_exists.verified==0?1:0;
            user_exists.verified=verifiedUser;
            await user_exists.save();
            const message= verifiedUser == 1 ? "El usuario ha sido verficado": "El usuario ha sido desverificado";
            try{
                await verified();
                const person = await people.findOne({
                    user_id: user_exists.id
                });
                const name = person? `${person.first_name} ${person.lastName} `:""
                await sendEmail({
                    from: mailerConfig.USER,
                    to:user_exists.email,
                    subject : verifiedUser == 1 ? "Has sido verificado": "Has sido desverificado",
                    html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Onliigo</title>
                    </head>
                    <body>
                        <div style="display: flex;justify-content: center;">
                            <img src="https://funcontes.org/imgs/onliigo.png" alt="" style="width: 200px;height: 200px;border-radius: 50%;">
                    
                            <p>Hola, ${name}</p>
                            <p style="text-align: justify;">Has sido verificado por el administrador, en este momento los usuarios que vean tus servicios tendrán más confianza y 
                                fiabilidad en la prestación de tus servicios </p>
                            
                            <p>
                                Atentamente,
                                OnliiGo (onliigo2020@gmail.com)
                            </p>
                        </div>
                    </body>
                    </html>`
                });    
            }catch(e){
                console.log("Error", e)
            }
            res.send({
                success:true,
                data:[],
                messages:[message]
            })
        }else{
            res.status(400).send({
                success:false,
                data:[],
                messages:["El usuario no existe"]
            })
        }
    }catch(e){
        console.log("Error",e)
        res.status(500).send({
            success:false,
            data:[],
            messages:e
        })
    }
    
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};