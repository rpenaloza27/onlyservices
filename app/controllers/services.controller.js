const db = require("../models");
const services = db.services;
const Op = db.Sequelize.Op;
const categories_services = db.categories_services;



// Create and Save a new Tutorial
exports.create = (req, res) => {
  const service = {
    name: req.body.name,
    short_description: req.body.short_description ? req.body.short_description : '',
    user_id: req.body.user_id,
  };
  services.create(service).then(data => {
    for (let i = 0; i < req.body.categories.length; i++) {
      const category_service = {
        service_id: data.id,
        category_id: req.body.categories[i]
      };
      categories_services
        .create(category_service).then(data => {

        }).catch(e => {
          res.status(400).send({
            success: false,
            data: [],
            message:
              err.message || "Some error occurred while creating the Tutorial."
          });
        })
    }
    res.send({
      success: true,
      data: [],
      message: "El servicio se ha creado con éxito"
    });
  }).catch(err => {
    res.status(400).send({
      success: false,
      data: [],
      message:
        err.message || "Some error occurred while creating the Tutorial."
    });
  });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
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