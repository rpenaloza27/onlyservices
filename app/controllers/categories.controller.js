const db = require("../models");
const categories_services = db.categories_services;
const services = db.services;
const categories = db.categories;
const user = db.users;
const people = db.people;
const Op = db.Sequelize.Op;

const service_images = db.service_images;



// Create and Save a new Tutorial
exports.create = (req, res) => {

};

// Create and Save a new Tutorial
exports.createCategories = async (req, res) => {
    const categories_array= req.categories;
    for (const category of categories_array) {
        // Save user in the database
        await categories.create(category) 
    }
    res.send({
        success:true,
        data:[],
        message:"Categorías creadas"
    })
};

exports.findAll = (req, res) => {
    //[Op.and]: [{ a: 5 }, { b: 6 }],
    categories
        .findAll({ where: { [Op.and]: [{ status: 1 }, { parent_id: null }] }, 
            include : {model : categories, as : "subcategories", include: {model : categories, as : "subcategories"}}
        })
        .then(categ => {
            if (categ.length > 0) {
                res.send({
                    success: true,
                    data: categ,
                    message: "Lista de categorías"
                })
            } else {
                res.status(400).send({
                    success: false,
                    data: [],
                    message: "No hay categorías"
                })
            }
        }).catch(e => {
            console.log("Error", e)
            res.status(400).send({
                success: false,
                data: [],
                message: e
            })
        })
}

exports.findSubcategories = (req, res) => {
    if (req.params.category_id) {
        categories
            .findAll({ where: 
                { [Op.and]: [{ status: 1 }, { parent_id: req.params.category_id }] },
                include : {model : categories, as : "subcategories", include: {model : categories, as : "subcategories"}}
            }
            )
            .then(categ => {
                if (categ.length > 0) {
                    res.send({
                        success: true,
                        data: categ,
                        message: "Lista de subcategorías"
                    })
                } else {
                    res.status(400).send({
                        success: false,
                        data: [],
                        message: "No hay subcategorías"
                    })
                }
            }).catch(e => {
                console.log("Error", e)
                res.status(400).send({
                    success: false,
                    data: [],
                    message: e
                })
            })
    }

}

// Retrieve all Tutorials from the database.
exports.findServicesByCategories = (req, res) => {

    if (req.params.category_id) {
        // ,
        categories_services.findAll({
            where: { category_id: req.params.category_id, },
            include: {
                model: services,
                include: [{ model: service_images, paranoid: false }, { model: user, include: people }],
                order: [
                    [{ model: user }, 'priority', 'asc']
                ],

            }, attributes: ['category_id'],

        })
            .then(data => {
                console.log("Datos", data)
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