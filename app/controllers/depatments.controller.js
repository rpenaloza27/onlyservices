const db = require("../models");
const departments = db.departments;
const countries = db.countries;
const Op = db.Sequelize.Op;



// Create and Save a new Tutorial
exports.create = (req, res) => {
  
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    departments.findAll({ where: { status: 1 } },{ include: countries })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
};

exports.findByCountry = (req, res) => {
    if(req.params.country_id){
        departments.findAll({ where: { country_id: req.params.country_id },include: countries })
      .then(data => {
        if(data.length > 0){
            res.send({
                success: true,
                data,
                message : "Lista de departamentos "
            });
        }else{
            res.status(400).send({
                success: true,
                data,
                message : "No hay departamentos para este país "
            });
        }
        
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
    }else{
        res.status(400).send({
            message:
              "El país requerido",
            params : req.params,
            query : req.query
        });
    }
    
};

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