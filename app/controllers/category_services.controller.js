const db = require("../models");
const categories_services = db.categories_services;
const services = db.services;
const user = db.users;
const people = db.people;
const Op = db.Sequelize.Op;



// Create and Save a new Tutorial
exports.create = (req, res) => {

};

// Retrieve all Tutorials from the database.
exports.findServicesByCategories = (req, res) => {

    if (req.params.category_id) {
        categories_services.findAll({
            where: { category_id: req.params.category_id },
            include: {
                model: services,
                include: { model: user, include: people }
            }, attributes: ['category_id']
        })
            .then(data => {
                if (data.length > 0) {
                    res.send({
                        success: true,
                        data,
                        message: "Lista de servivios "
                    });
                } else {
                    res.status(400).send({
                        success: true,
                        data,
                        message: "No hay servicios "
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials."
                });
            });
    }

};

//find Services by categories
exports.findByCategory = (req, res) => {

    services.findAll()
        .then(data => {
            if (data.length > 0) {
                res.send({
                    success: true,
                    data,
                    message: "Lista de servivios "
                });
            } else {
                res.status(400).send({
                    success: true,
                    data,
                    message: "No hay servicios "
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
}

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

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