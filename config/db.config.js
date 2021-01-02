module.exports = {
    HOST: "db-mysql-nyc1-56592-do-user-8510195-0.b.db.ondigitalocean.com",
    USER: "doadmin",
    PASSWORD: "rdwjl11h0rl89p70",
    DB: "onlyservices",
    port : 25060,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };