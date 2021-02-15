const db = require("../models");
const services = db.services;
const user = db.users;
const people = db.people;
const service_comments = db.service_comments;
const Op = db.Sequelize.Op;
const categories_services = db.categories_services;
const service_images = db.service_images;
const service_details = db.service_details;
const { resolveUrl } = require("../services/image_url_resolver");
const { getPagination, getPagingData } = require("../services/pagination.service");




// Create and Save a new Services
exports.create = (req, res) => {
  const service = {
    name: req.body.name,
    short_description: req.body.short_description ? req.body.short_description : '',
    user_id: req.body.user_id,
    long_description: req.body.long_description ? req.body.long_description : '',
    price: req.body.price ? req.body.price : 0
  };
  services.create(service).then(async data => {
    for (let i = 0; i < req.body.categories.length; i++) {
      const category_service = {
        service_id: data.id,
        category_id: req.body.categories[i]
      };
      try {
        const data_s = await categories_services
          .create(category_service)
      } catch (e) {
        res.status(400).send({
          success: false,
          data: [],
          message:
            e || "Some error occurred while creating the Tutorial."
        });
        return;
      }
    }
    const service_u = await services.findOneCustom(data.id)
    res.send({
      success: true,
      data: [service_u],
      message: "El servicio se ha creado con éxito"
    });
  }).catch(err => {
    res.status(400).send({
      success: false,
      data: [{ obj: req.body }],
      message:
        err.message || "Some error occurred while creating the Tutorial."
    });
  });
};

// Retrieve all Services from the database.
exports.findAll = (req, res) => {
  services.findAll({
    limit,
    offset,
    include: [{ model: service_images, paranoid: false }, { model: user, include: people }, { model: service_comments }]
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
};

exports.searchServices = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  services.findAndCountAll(
    {
      limit,
      offset,
      where: {
        [Op.or]: [
          { name: { [Op.substring]: req.query.search } },
          { long_description: { [Op.substring]: req.query.search } },
          { short_description: { [Op.substring]: req.query.search } }
        ],
      },
      include: [{ model: service_images, paranoid: false }, { model: user, include: people }]
    }
  ).then(data => {
    const response = getPagingData(data, page, limit, req);
    if (data.rows.length > 0) {
      res
        .send({
          succes: true,
          data: response,
          message: "Lista de servicios"
        })
    } else {
      res.status(400).send({
        succes: false,
        data: [],
        message: "No hay servicios en esta categoría"
      })
    }
  }).catch(e => {
    res.status(400).send({
      succes: false,
      data: [],
      message: e
    })
  })
}

exports.createCommentService = async (req, res) => {
  service_comments.create({
    comment: req.body.comment,
    qualification: req.body.qualification ? req.body.qualification : 0,
    user_id: req.body.user_id,
    service_id: req.body.service_id
  }).then(async service_comment => {
    if (service_comment != null) {
      const comments = await services.getComments(req.body.service_id);
      let qualification = 0;
      if (comments.length > 0) {
        for (let index = 0; index < comments.length; index++) {
          const element = comments[index];
          qualification += element.qualification ? element.qualification : 0
        }
        qualification= qualification/comments.length;
      }
      const service_u = await services.findOneCustom(req.body.service_id);
      try {
        service_u.qualification = Number(qualification.toFixed(1));
        await service_u.save()
      } catch (e) {
        res.send({
          success: false,
          data: [],
          message: "Can't update the service" +e
        })
      }

      res.send({
        success: true,
        data: [service_comment],
        message: "Comentario guardado"
      })
    } else {
      res.status(400).send({
        succes: false,
        data: [],
        message: "No se pudo crear el comentario"
      })
    }
  }).catch(e => {
    res.status(400).send({
      succes: false,
      data: [],
      message: e
    })
  })
}

exports.delete = async (req, res) => {
  try {
    const service_exists = await services.exists(req.params.service_id);
    if (service_exists) {
      categories_services.destroy({
        where: {
          service_id: req.params.service_id
        }
      }).then(category_delete => {
        service_images.destroy({
          where: {
            service_id: req.params.service_id
          }
        }).then(service_images_delete => {
          service_details.destroy({
            where: {
              service_id: req.params.service_id
            }
          }).then(service_details_delete => {
            services.destroy(
              {
                where: {
                  id: req.params.service_id
                }
              }
            ).then(service_delete => {
              if (service_delete) {
                res.send({
                  succes: true,
                  data: [],
                  message: "El servicio ha sido eliminado"
                })
              } else {
                res.status(400).send({
                  succes: false,
                  data: [],
                  message: "El servicio no se pudo eliminar"
                })
              }
            }).catch(e => {
              res.status(400).send({
                succes: false,
                data: [],
                message: e
              })
            })
          }).catch(e => {
            res.status(400).send({
              succes: false,
              data: [],
              message: e
            })
          })

        }).catch(e => {
          res.status(400).send({
            succes: false,
            data: [],
            message: e
          })
        })

      }).catch(e => {
        res.status(400).send({
          succes: false,
          data: [],
          message: e
        })
      })
    } else {
      res.status(400).send({
        succes: false,
        data: [],
        message: "El servicio no existe"
      })
    }
  } catch (e) {
    res.status(400).send({
      succes: false,
      data: [],
      message: e
    })
  }
}

exports.uploadImages = async (req, res, err) => {

  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      const service_image = {
        url: resolveUrl(req.files[i].filename),
        service_id: req.body.service_id
      }
      try {
        const response = await service_images
          .create(service_image)
      } catch (e) {
        res.status(400).send({
          success: false,
          data: req.files,
          message: e
        })
        return;
      }
    }

    res.send({
      success: true,
      data: req.files,
      message: "Archivos subidos"
    })
  } else {
    res.status(400).send({
      success: false,
      data: [],
      message: "Debe subir algún archivo"
    })
  }
}

exports.findOne = (req, res) => {
  if (req.params.id) {
    services
      .findOne({ where: { id: req.params.id }, include: [{ model: service_images, paranoid: false }, { model: user, include: people }] })
      .then(service => {
        if (service != null) {
          res.send({
            succes: false,
            data: [service],
            message: "Servicio encontrado"
          })
        } else {
          res.send({
            succes: false,
            data: [],
            message: "El servivio no existe"
          })
        }
      });
  } else {
    res.send({
      succes: false,
      data: [],
      message: "El id es requerido"
    })
  }

}

exports.findServiceComments = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  service_comments.findAndCountAll({
    limit,
    offset,
    where: { service_id: req.params.service_id },
  }).then(comments => {
    const response = getPagingData(comments, page, limit, req);
    if (comments.rows.length > 0) {
      res.send({
        success: true,
        data: [response],
        message: "Lista de comentarios"
      })
    } else {
      res.status(400).send({
        success: false,
        data: [],
        message: "No hay más comentarios"
      })
    }
  })
}

exports.addVisit = async (req, res) => {
  const service = await services.findOneCustom(req.params.service_id);
  if (service != null) {
    service.number_of_visits++;
    try {
      await service.save()
      res.send({
        succes: true,
        data: [service],
        message: "Número de visitas actualizada"
      })
    } catch (e) {
      res.status(400).send({
        succes: false,
        data: [],
        message: "No se pudo actualizar el servicio"
      })
    }
  } else {
    res.status(400).send({
      succes: false,
      data: [],
      message: "El servicio no existe"
    })
  }
}

exports.findServicesByUser = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  services.findAndCountAll({
    limit,
    offset,
    where: { user_id: req.params.user_id },
    include: [{ model: service_images, paranoid: false }, { model: user, include: people }, { model: service_comments }]
  }).then(data => {
    const response = getPagingData(data, page, limit, req);
    if (data.rows.length > 0) {
      res.send({
              succes: true,
              data: response,
              message: "Lista de servicios"
            })

    } else {
      res.status(400)
        .send({
          succes: false,
          data: response,
          message: "No hay datos con estos criterios"
        })
    }
  }).catch(e => {
    res.status(400).send({
      succes: false,
      data: [],
      message: "Ocurrión un error" + e
    })
  })

}


// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (req.params.service_id) {
    services.findOne({
      id: req.params.service_id
    }).then(service => {
      if (service != null) {
        services.update({
          name: req.body.name,
          short_description: req.body.short_description,
          long_description: req.body.long_description,
          price: req.body.price
        }, { where: { id: req.params.service_id } })
          .then(data => {
            res.send({
              succes: true,
              data: [
                data
              ],
              message: "Servicio actualizado"
            })
          }).catch(e => {
            res.send({
              succes: false,
              data: [

              ],
              message: e
            })
          })
      } else {
        res.status(400).send({
          succes: false,
          data: [

          ],
          message: "El servicio no se ha encontrado"
        })
      }
    }).catch(e => {
      res.status(400).send({
        succes: false,
        data: [

        ],
        message: e
      })
    })

  } else {
    res.status(400).send({
      succes: false,
      data: [

      ],
      message: "El id es requerido"
    })
  }
};



// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};