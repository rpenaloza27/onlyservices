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
router.post("/comment/create", services.createCommentService)
router.get("/comments/:service_id", services.findServiceComments)
router.get("/all/search/", services.searchServices)
router.get("/categories/all/:service_id", services.findCategoriesServices)
router.put("/update/:service_id", services.update)
router.put("/update/add_visit/:service_id", services.addVisit)
router.delete("/delete/:service_id", services.delete);
router.delete("/delete/image/:id", services.deleteImage);
router.get("/featured/all", services.findServicesFeatured);


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
