const db = require("../models");
const categories_services = db.categories_services;
const services = db.services;
const categories = db.categories;
const user = db.users;
const people = db.people;
const Op = db.Sequelize.Op;
const payment_types = db.payment_types

const service_images = db.service_images;



// Create and Save a new Tutorial
exports.create = (req, res) => {

};

// Create and Save a new Tutorial
exports.createCategories = async (req, res) => {
    const categories_array= req.body.categories;
    console.log("Categories", categories_array)
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
    payment_types
        .findAll({ where: { [Op.and]: [{ status: 1 }] }
        })
        .then(payment => {
            if (payment.length > 0) {
                res.send({
                    success: true,
                    data: payment,
                    message: "Lista de métodos de pago"
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