const payment_types_controller = require("../controllers/payment_types.controller");
var router = require("express").Router();

// Create a new Tutorial
// router.post("/", tutorials.create);

// Retrieve all Tutorials
router.get("/", payment_types_controller.findAll);
module.exports = router;
