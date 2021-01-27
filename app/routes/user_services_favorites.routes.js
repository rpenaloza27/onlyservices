const user_services_favorites = require("../controllers/user_services_favorites.controller");
var router = require("express").Router();
const image_service = require("../services/image_upload.service");

// Create a new Tutorial
// router.post("/", tutorials.create);

// Retrieve all Tutorials
router.post("/", user_services_favorites.create);
// router.get("/user_favorites/:user_id", user_services_favorites.findBy);

router.get("/user_favorites/:user_id", user_services_favorites.findByUser);


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