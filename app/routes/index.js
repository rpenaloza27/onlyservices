const countries_routes = require("./countries.routes");
const departments_routes = require("./departments.routes");
const municipalities_routes = require("./municipalities.routes");
const documents_types_routes = require("./documents_types_.routes");
const users_routes = require("./user.routes");
const categories_services_routes = require("./categoy_services.routes");
const services_routes = require("./services.routes");
const categories_routes = require("./categories.routes");
const favorites_routes = require("./user_services_favorites.routes");
const payment_types = require("./payment_types.routes")
const imgs_routes = require("./imgs.routes")
const express = require("express");
const fs = require("fs");

module.exports = (app) => {
    app.use("/backend/imgs",imgs_routes);
    app.use("/backend/countries", countries_routes);
    app.use("/backend/departments", departments_routes);
    app.use("/backend/municipalities", municipalities_routes);
    app.use("/backend/documents_types", documents_types_routes);
    app.use("/backend/users", users_routes);
    app.use("/backend/categories_services", categories_services_routes);
    app.use("/backend/services", services_routes);
    app.use("/backend/categories", categories_routes);
    app.use("/backend/favorites", favorites_routes);
    //payment_types
    app.use("/backend/payment_types", payment_types);
    return app;
}
