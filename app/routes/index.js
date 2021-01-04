const countries_routes = require("./countries.routes");
const departments_routes = require("./departments.routes");
const municipalities_routes = require("./municipalities.routes");
const documents_types_routes = require("./documents_types_.routes");
const users_routes = require("./user.routes");
const categories_services_routes = require("./categoy_services.routes");
const services_routes = require("./services.routes");
module.exports = (app) => {
    app.use("/countries", countries_routes);
    app.use("/departments", departments_routes);
    app.use("/municipalities", municipalities_routes);
    app.use("/documents_types", documents_types_routes);
    app.use("/users", users_routes);
    app.use("/categories_services", categories_services_routes);
    app.use("/services", services_routes);
}