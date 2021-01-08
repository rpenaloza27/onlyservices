const db = require("../models");
const services = db.services;
const user = db.users;
const people = db.people;
const Op = db.Sequelize.Op;
const categories_services = db.categories_services;
const service_images = db.service_images;
const { resolveUrl} = require("../services/image_url_resolver");



// Create and Save a new Services
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
      data: [{obj : req.body}],
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

exports.uploadImages = (req, res ,err) => {
  
  if (req.files) {
    for(let i = 0; i < req.files.length ; i++){
      const service_image = {
        url : resolveUrl(req.files[i].filename),
        service_id : req.body.service_id
      }
      service_images
      .create(service_image)
      .then(data => {

      }).catch(e => {
        if(i == (req.files.length-1)){
          res.status(400).send({
            success: false,
            data: req.files,
            message: e
          })
        }
      })
    }
    
    res.send({
      success: true,
      data: req.files,
      message: "Archivos subidos"
    })
  }else{
    res.status(400).send({
      success: false,
      data: [],
      message: "Debe subir algún archivo"
    })
  }
}

exports.findServicesByUser =(req, res) => {
  services
  .findAll({where : {user_id: req.params.user_id}, include : [{ model: service_images,paranoid: false } ,{ model: user, include: people }]})
  .then(data => {
    if(data.length > 0){
      res.send({
        succes: true,
        data,
        message : "Lista de servicios del usuario"
      })
    }else{
      res.status(400).send({
        succes: false,
        data : [],
        message : "El usuario actualmente no tiene servicios"
      })
    }
    

  }).catch(e => {
    res.status(400).send({
      succes: false,
      data: [e],
      message : "Ocurrió un error al intentar buscar los servicios"
    })
  })
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