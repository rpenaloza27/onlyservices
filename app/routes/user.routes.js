const users = require("../controllers/user.controller");
var router = require("express").Router();

// Create a new Tutorial
// router.post("/", tutorials.create);

// Retrieve all Tutorials
router.post("/", users.create);
router.get("/:user_id", users.findOne);
router.get("/", users.findAll);


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