const db = require("../models");
const documents_types = db.documents_types;
const Op = db.Sequelize.Op;



// Create and Save a new Tutorial
exports.create = (req, res) => {
  
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    documents_types.findAll()
      .then(data => {
        if(data.length > 0){
            res.send({
                success: true,
                data,
                message : "Lista de documentos "
            });
        }else{
            res.status(400).send({
                success: true,
                data,
                message : "No hay documentos "
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