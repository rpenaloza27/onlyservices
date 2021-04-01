const dbConfig = require("../../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port : dbConfig.port,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.roles = require("./roles.model")(sequelize, Sequelize);
db.users = require("./users.model")(sequelize, Sequelize, db.roles);
db.documents_types = require("./document_types.model")(sequelize, Sequelize);
db.countries = require("./countries.model")(sequelize, Sequelize);
db.departments = require("./departments.model")(sequelize, Sequelize, db.countries);
db.municipios = require("./municipalities.model")(sequelize, Sequelize, db.departments);

db.people = require("./people.model")(sequelize, Sequelize, db.documents_types, db.users, db.municipios);
db.companies = require("./companies.model")(sequelize, Sequelize, db.users);
db.categories = require("./categories.model")(sequelize, Sequelize);
db.service_details = require("./service_details.model")(sequelize, Sequelize, db.users,db.companies);
db.service_comments = require("./service_comments.model")(sequelize, Sequelize, db.users);
db.service_images = require("./service_images.model")(sequelize, Sequelize);
db.services = require("./services.model")(sequelize, Sequelize, db.users, db.service_details, db.service_images, db.service_comments,db.people,db.categories, db.categories_services);
db.categories_services = require("./categories_services.model")(sequelize, Sequelize, db.services, db.categories);
db.services_cities= require("./services_cities.model")(sequelize, Sequelize,db.services, db.municipios)
db.user_services_favorites = require("./user_services_favorites.model")(sequelize, Sequelize, db.services, db.users);
const models = Object.keys(db).filter(key=> key!='Sequelize' && key!='sequelize' && key!='module')
models.forEach(async key=>{
  try{
    console.log("Key", key,"color:yellow")
    await db[key].sync();
  }catch(e){
    console.log("Error DB", e)
  }
  
})
module.exports = db;
