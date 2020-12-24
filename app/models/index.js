const dbConfig = require("../../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

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
db.documents_types = require("./document_types.model")(sequelize, Sequelize);
db.users = require("./users.model")(sequelize, Sequelize, db.roles);
db.people = require("./users.model")(sequelize, Sequelize, db.documents_types, db.users);

module.exports = db;
