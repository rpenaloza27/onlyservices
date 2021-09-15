const db = require("../models");
const municipios = db.municipios;
const departamentos = db.departments
const countries = db.countries;
const Op = db.Sequelize.Op;



// Create and Save a new Tutorial
exports.create = (req, res) => {
  
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    
    municipios.findAll({ where: { status: 1 } },{ include: countries })
      .then(data => {
        if(data.length > 0){
            res.send({
                success: true,
                data,
                message : "Lista de municipios "
            });
        }else{
            res.status(400).send({
                success: true,
                data,
                message : "No hay municipios para este departamentos "
            });
        }
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
};

exports.findByDepartment = (req, res) => {
    if(req.params.department){
        municipios.findAll({ where: { departamento_id: req.params.department } , include : departamentos })
      .then(data => {
        if(data.length > 0){
            res.send({
                success: true,
                data,
                message : "Lista de municipios "
            });
        }else{
            res.status(400).send({
                success: true,
                data,
                message : "No hay municipios para este departamento "
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

// Find a single City with an id
exports.findOneByName = (req, res) => {
  if(req.params.city){
    municipios.findOne({
      where :{
        name: { [Op.substring]: req.params.city.toUpperCase() } 
      },
      include : departamentos
    }).then(data=>{
      if(data){
        res.send({
          success:true,
          data:[data],
          message:"Ciudad"
        })
      }else{
        res.status(400).send({
          success:true,
          data:[],
          message:"Ciudad no encontrada"
        })
      }
    })
  }else{
    res.send({
      success:false,
      data:[],
      message:"la ciudad es requerida"
    })
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