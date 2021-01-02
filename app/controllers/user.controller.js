const db = require("../models");
const users = db.users;
const people = db.people;
const Op = db.Sequelize.Op;



// Create and Save a new Tutorial
exports.create = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
        firebase_id: req.body.firebase_id,
        role_id: req.body.role_id,
        priority : 5
    };
    // Save user in the database
    users.create(user)
        .then(data => {
            const person = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                city_id: req.body.city_id,
                document_type : req.body.document_type ? eq.body.document_type : 1,
                user_id : data.id                
            }
            people.create(person)
            .then(data => {
                res.send({
                    success: true,
                    data,
                    message : "Usuario creado exitosamente"
                });
            });
        })
        .catch(err => {
            res.status(400).send({
                success : false,
                data : [],
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

exports.findAll = (req, res ) => {
    people.
        findAll()
        .then(data => {
            if(data.length > 0){
                res.send({
                    success: true,
                    data,
                    message : "Usuario encontrado"
                });
            }else{
                res.status(400).send({
                    success: false,
                    data,
                    message : "Usuario  no encontrado"
                });
            }
        });
}

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    if(req.params.user_id){
        people.
        findOne({ where : { user_id : req.params.user_id}, include : users})
        .then(data => {
            res.send({
                success: true,
                data,
                message : "Usuario encontrado"
            });
        });
    }else{
        res.staus(400).send({
            success: false,
            data : [],
            message : "El id de usuario es requerido"
        });
    }
};

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