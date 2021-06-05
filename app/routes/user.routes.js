const users = require("../controllers/user.controller");
var router = require("express").Router();
const image_service = require("../services/image_upload.service");

// Create a new Tutorial
// router.post("/", tutorials.create);

// Retrieve all Tutorials
router.post("/", users.create);
router.get("/:user_id", users.findOne);
router.get("/tests/:firebase_id", users.userExist);
router.get("/firebase/:user_id", users.findOneByFirebaseId);
router.put("/update_profile_image", image_service.saveImages("profile_photo", true), users.updateProfileImage);
router.put("/delete_profile_image", users.deleteProfileImage); 
router.put("/update_firebase_id", users.updateFirebaseIdByEmail);
router.put("/update/:user_id", users.update);
router.get("/", users.findAll);
router.get("/companies/featured", users.findAllBusiness);


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