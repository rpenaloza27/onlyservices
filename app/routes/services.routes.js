const services = require("../controllers/services.controller");
var router = require("express").Router();
const image_service = require("../services/image_upload.service");
// Create a new Tutorial
// router.post("/", tutorials.create);

// Retrieve all Tutorials
router.post("/create", services.create);
router.get("/:id", services.findOne);
router.post("/upload_images", image_service.saveImages('photos') ,services.uploadImages);
router.get("/user_services/:user_id", services.findServicesByUser)
router.put("/update/:service_id", services.update)
router.delete("/delete/:service_id", services.delete);


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
