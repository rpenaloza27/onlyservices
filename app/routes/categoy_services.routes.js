const categories_services = require("../controllers/category_services.controller");
var router = require("express").Router();

// Create a new Tutorial
// router.post("/", tutorials.create);

// Retrieve all Tutorials
router.get("/services/:category_id", categories_services.findServicesByCategories);
router.get("/services/search/categories/:category_id", categories_services.findServicesByCategoriesSearch);

// Retrieve all published Tutorials
// router.get("/published", tutorials.findAllPublished);

// Retrieve a single Tutorial with id
// router.get("/:id", tutorials.findOne);

// Update a Tutorial with id
// router.put("/:id", tutorials.update);

// // Delete a Tutorial with id
// router.delete("/:id", tutorials.delete);

// // Delete all Tutorials
// router.delete("/", tutorials.deleteAll);

module.exports = router;