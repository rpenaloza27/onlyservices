const documents_types = require("../controllers/documents_types.controller");
var router = require("express").Router();

// Create a new Tutorial
// router.post("/", tutorials.create);

// Retrieve all Tutorials
router.get("/", documents_types.findAll);
// router.get("/:department", municipalities.findByDepartment);

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