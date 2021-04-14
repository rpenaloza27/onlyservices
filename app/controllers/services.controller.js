const db = require("../models");
const { payment_types, departments, countries } = require("../models");
const services = db.services;
const user = db.users;
const people = db.people;
const service_comments = db.service_comments;
const Op = db.Sequelize.Op;
const categories_services = db.categories_services;
const service_images = db.service_images;
const service_details = db.service_details;
const categories = db.categories;
const municipios = db.municipios;
const services_cities = db.services_cities;
const { resolveUrl } = require("../services/image_url_resolver");
const { getPagination, getPagingData } = require("../services/pagination.service");
const fs = require("fs");
const enviroment = require("../../environment/enviroment");

const { companies } = require("../models");




// Create and Save a new Services
exports.create = (req, res) => {
  const service = {
    name: req.body.name,
    short_description: req.body.short_description ? req.body.short_description : '',
    user_id: req.body.user_id,
    long_description: req.body.long_description ? req.body.long_description : '',
    price: req.body.price ? req.body.price : 0,
    payment_type: req.body.payment_type ? req.body.payment_type : 0,
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
    if(req.body.scale_type){
      switch(req.body.scale_type){
        case 'city':
          const service_city ={
            service_id: data.id,
            city_id: req.body.city_id,
          }
          try {
            const data_s = await services_cities
              .create(service_city)
          } catch (e) {
            res.status(400).send({
              success: false,
              data: [],
              message:
                e || "Some error occurred while creating the Tutorial."
            });
            return;
          }
          break;
        case 'departament':
          const departament = req.body.departament || 2;
          const cities_ = await municipios.findAll({
            where:{
              departamento_id: departament
            }
          })
          for (let i = 0; i < cities_.length; i++) {
            const service_city = {
              service_id: data.id,
              city_id: cities_[i].id,
            };
            try {
              const data_s = await services_cities
                .create(service_city)
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
          break;
        case 'country':
          const country = req.body.country || 52;
          const cities_of_country = await countries.findOne({
            where :{
              id: country
            },
            include:[{model:departments ,as:'departments',include:{model:municipios, as:'municipalities'}}]
          })
          const cities=[];
          if(cities_of_country!=null){
            const cities_muni =cities_of_country.dataValues;
            console.log("Country", cities_muni)
            for(let i=0;i<cities_muni.departments.length;i++){
              console.log("Department")
              const depart_cities = cities_of_country.departments[i].municipalities;
              for(let j=0;j<depart_cities.length;j++){
                console.log("cities")
                const service_city = {
                  service_id: data.id,
                  city_id: depart_cities[j].id,
                };
                cities.push(service_city);
              }
            }
            await services_cities.bulkCreate(cities)
          }
          res.send({
            success:true,
            data:[cities_of_country],
            message: "No se creé el servicio"
          })
          return;
          break;
      }
    }else{
      if (req.body.cities) {
        for (let i = 0; i < req.body.cities.length; i++) {
          const service_city = {
            service_id: data.id,
            city_id: req.body.cities[i],
          };
          try {
            const data_s = await services_cities
              .create(service_city)
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
    include: [{ model: payment_types,as: 'Payment_Type', }, { model: service_images, paranoid: false }, { model: user, include: [{ model: people }, { model: companies }] }, { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } }]
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
  let { page, size, minimum, maximum } = req.query;
  const { limit, offset } = getPagination(page, size);
  //filters city_id, minimum,maximum
  let city_id = 0;
  minimum = minimum ? Number(minimum) : 0
  maximum = maximum ? Number(maximum) : 0
  if (req.query.city_id) {
    city_id = req.query.city_id
  }
  let t = ""
  if (city_id == 0) {
    let object_options = {
      limit,
      offset,
      where: {
        [Op.or]: [
          { name: { [Op.substring]: req.query.search } },
          { long_description: { [Op.substring]: req.query.search } },
          { short_description: { [Op.substring]: req.query.search } }
        ],
      },
      include: [
        { model: service_images, paranoid: false },
        { model: payment_types,as: 'Payment_Type', },
        {
          model: user, include:
            [{ model: people }, { model: companies }]
        },
        { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } },
        {
          model: services_cities, include:
          {
            model: municipios,
          }
        }
      ]
    }
    //[Op.between]: [6, 10],    

    let object_with_filters;
    if (typeof minimum != 'undefined' && minimum > 0) {

      if (typeof maximum != 'undefined' && maximum > 0) {
        //Both Filters Maximum and minimum
        object_with_filters = {
          limit,
          offset,
          where: {
            [Op.or]: [
              { name: { [Op.substring]: req.query.search } },
              { long_description: { [Op.substring]: req.query.search } },
              { short_description: { [Op.substring]: req.query.search } },
              { price: { [Op.between]: [minimum, maximum] } }
            ],
          },
          include: [{ model: service_images, paranoid: false },
          { model: payment_types,as: 'Payment_Type', },
          {
            model: user, include:
              [{ model: people }, { model: companies }]
          },
          { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } },
          {
            model: services_cities, include:
            {
              model: municipios,
            }
          }
          ]
        }
      } else {
        //Minimum only
        object_with_filters = {
          limit,
          offset,
          where: {
            [Op.or]: [
              { name: { [Op.substring]: req.query.search } },
              { long_description: { [Op.substring]: req.query.search } },
              { short_description: { [Op.substring]: req.query.search } },
              { price: { [Op.gte]: minimum, } }
            ],
          },
          include: [{ model: service_images, paranoid: false },
          { model: payment_types,as: 'Payment_Type', },
          {
            model: user, include:
              [{ model: people }, { model: companies }]
          },
          { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } },
          {
            model: services_cities, include:
            {
              model: municipios,
            }
          }
          ]
        }
      }

    } else {
      //Maximum only
      if (typeof maximum != 'undefined' && maximum > 0) {
        object_with_filters = {
          limit,
          offset,
          where: {
            [Op.or]: [
              { name: { [Op.substring]: req.query.search } },
              { long_description: { [Op.substring]: req.query.search } },
              { short_description: { [Op.substring]: req.query.search } },
              { price: { [Op.lte]: maximum, } }
            ],
          },
          include: [{ model: service_images, paranoid: false },
          { model: payment_types,as: 'Payment_Type', },
          {
            model: user, include:
              [{ model: people }, { model: companies }]
          },
          { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } },
          {
            model: services_cities, include:
            {
              model: municipios,
            }
          }
          ]
        }
      } else {
        //None price filter
        object_with_filters = object_options;
      }

    }

    services.findAndCountAll(object_with_filters).then(data => {
      const response = getPagingData(data, page, limit, req);
      if (data.rows.length > 0) {
        res
          .send({
            succes: true,
            data: response,
            message: "Lista de servicios",
            limit,
            offset
          })
      } else {
        res.status(400).send({
          succes: false,
          data: [],
          message: "No hay servicios",
          limit,
          offset
        })
      }
    }).catch(e => {
      console.log("Error",e)
      res.status(400).send({
        succes: false,
        data: [],
        message: e
      })
    })
  } else {
    let object_options = {
      limit,
      offset,
      where: {
        [Op.or]: [
          { name: { [Op.substring]: req.query.search } },
          { long_description: { [Op.substring]: req.query.search } },
          { short_description: { [Op.substring]: req.query.search } }
        ],
      },
      include: [{ model: service_images, paranoid: false },

      {
        model: user, include:
          [{ model: people }, { model: companies }]
      },
      { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } },
      {
        model: services_cities, include:
        {
          model: municipios,
        }, where: {
          [Op.or]: [
            { city_id: req.query.city_id },
          ],
        }
      }
      ]
    }
    //[Op.between]: [6, 10],    

    let object_with_filters;
    if (typeof minimum != 'undefined' && minimum > 0) {
      t = "minimum"
      if (typeof maximum != 'undefined' && maximum > 0) {
        t = "minimum maximum"
        //Both Filters Maximum and minimum
        object_with_filters = {
          limit,
          offset,
          where: {
            [Op.or]: [
              { name: { [Op.substring]: req.query.search } },
              { long_description: { [Op.substring]: req.query.search } },
              { short_description: { [Op.substring]: req.query.search } },
            ],
            price: { [Op.between]: [minimum, maximum] }
          },
          include: [{ model: service_images, paranoid: false },

          {
            model: user, include:
              [{ model: people }, { model: companies }]
          },
          { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } },
          {
            model: services_cities, include:
            {
              model: municipios,
            }, where: {
              [Op.or]: [
                { city_id: req.query.city_id },
              ],
            }
          }
          ]
        }
      } else {
        //Minimum only
        object_with_filters = {
          limit,
          offset,
          where: {
            [Op.or]: [
              { name: { [Op.substring]: req.query.search } },
              { long_description: { [Op.substring]: req.query.search } },
              { short_description: { [Op.substring]: req.query.search } },
            ],
            price: { [Op.gte]: minimum, }
          },
          include: [{ model: service_images, paranoid: false },

          {
            model: user, include:
              [{ model: people }, { model: companies }]
          },
          { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } },
          {
            model: services_cities, include:
            {
              model: municipios,
            }, where: {
              [Op.or]: [
                { city_id: req.query.city_id },
              ],
            }
          }
          ]
        }
      }

    } else {
      //Maximum only
      if (typeof maximum != 'undefined' && maximum > 0) {
        t = "maximo";
        object_with_filters = {
          limit,
          offset,
          where: {
            [Op.or]: [
              { name: { [Op.substring]: req.query.search } },
              { long_description: { [Op.substring]: req.query.search } },
              { short_description: { [Op.substring]: req.query.search } },
            ],
            price: { [Op.lte]: maximum, }
          },
          include: [{ model: service_images, paranoid: false },

          {
            model: user, include:
              [{ model: people }, { model: companies }]
          },
          { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } },
          {
            model: services_cities, include:
            {
              model: municipios,
            }, where: {
              [Op.or]: [
                { city_id: req.query.city_id },
              ],
            }
          }
          ]
        }
      } else {
        //None price filter
        object_with_filters = object_options;
      }

    }
    services.findAndCountAll(
      object_with_filters
    ).then(data => {
      const response = getPagingData(data, page, limit, req);
      if (data.rows.length > 0) {
        res
          .send({
            succes: true,
            data: response,
            message: "Lista de servicios",
            t
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
}

exports.findCategoriesServices = (req, res) => {
  categories_services.findAll({
    where: {
      service_id: req.params.service_id
    },
    include: { model: categories }
  }).then(data => {
    if (data.length > 0) {
      res.send({
        success: true,
        data,
        message: "Lista de categorías"
      })
    } else {
      res.status(400).send({
        success: false,
        data: [],
        message: "No tiene categorías"
      })
    }
  }).catch(e => {
    res.status(400).send({
      success: false,
      data: [],
      message: e
    })
  })
}

exports.findServicesFeatured = (req, res) => {
  services.findAll({
    where: {
      number_of_visits: { [Op.gte]: 8 }
    },
    include: [{ model: service_images, paranoid: false },
      { model: payment_types,as: 'Payment_Type', },
    {
      model: user, include:
        [{ model: people }, { model: companies }]
    },
    { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } },
    {
      model: services_cities, include:
      {
        model: municipios,
      }
    }
    ]
  }).then(data => {
    if (data.length > 0) {
      res.send({
        success: true,
        data,
        message: "Lista de servicios destacados"
      })
    } else {
      res.status(400).send({
        success: false,
        data: [],
        message: "No hay servicios destacados"
      })
    }
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
        qualification = qualification / comments.length;
      }
      const service_u = await services.findOneCustom(req.body.service_id);
      try {
        service_u.qualification = Number(qualification.toFixed(1));
        await service_u.save()
      } catch (e) {
        res.send({

          success: false,
          data: [],
          message: "Can't update the service" + e
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
      .findOne({
        where: { id: req.params.id },
        include:
          [
            { model: payment_types,as: 'Payment_Type', },
            { model: service_images, paranoid: false },
          { model: user, include: [{ model: people }, { model: companies }] },
          { model: service_comments, include: { model: user, include: people } },
          { model: services_cities, include: municipios }
          ]
      })
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
    include: { model: user, include: [{ model: people }, { model: companies }] }
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

exports.deleteImage = async (req, res) => {
  const image = await service_images.findOne({
    where: {
      id: req.params.id
    }
  })
  if (image != null) {
    const env_path = enviroment.production ? enviroment.URL : enviroment.URL_LOCAL;
    const url = `public/${image.url.replace(env_path, "")}`;
    fs.unlink(url, function (err) {
      if (err) {
        res.status(400).send({
          success: false,
          data: [{ url, image_url: image.url }],
          message: "No se encontró la ruta del archivo " + err
        })
        return console.log(err);
      }
      service_images.destroy({
        where: {
          id: req.params.id
        }
      }).then(data_deleted => {
        res.send({
          success: true,
          data: [data_deleted],
          message: "Imagen Eliminada"
        })
      }).catch(e => {
        res.status(400).send({
          success: true,
          data: [],
          message: "No se pudo eliminar la imagen"
        })
      })

      console.log('file deleted successfully');
    });

  } else {
    res.status(400)
      .send({
        success: true,
        data: [],
        message: "No se encontró la imagen"
      })
  }
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
    include: [{ model: payment_types,as: 'Payment_Type', },{ model: service_images, paranoid: false }, { model: user, include: [{ model: people }, { model: companies }] }, { model: service_comments, include: { model: user, include: [{ model: people }, { model: companies }] } }]
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
          price: req.body.price,
          payment_type: req.body.payment_type? req.body.payment_type:undefined
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