const users = require("../controllers/user.controller");
var router = require("express").Router();
const image_service = require("../services/image_upload.service");

// Create a new Tutorial
// router.post("/", tutorials.create);
const fs=require("fs")
// Retrieve all Tutorials
router.post("/", users.create);
router.get("/imgs/:path", (req, res)=>{
    const path= req.params.path;
    const format = path.substring(path.lastIndexOf('.')+1, path.length) || path
    const formatWithoutDot = format.replace(".", "");
    const filePath = `../../public/imgs/${path}`; 
    // or any file format

    // Check if file specified by the filePath exists
    fs.stat(filePath, function (exists) {
        if (exists) {
            // Content-type is very interesting part that guarantee that
            // Web browser will handle response in an appropriate manner.
            res.writeHead(200, {
                "Content-Type": `image/${formatWithoutDot}`,
                "Content-Disposition": "attachment; filename=" + path
            });
            fs.createReadStream(filePath).pipe(res);
            return;
        }
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("ERROR File does not exist");
    });
});
router.get("/:user_id", users.findOne);
router.get("/tests/:firebase_id", users.userExist);
router.get("/firebase/:user_id", users.findOneByFirebaseId);
router.put("/update_profile_image", image_service.saveImages("profile_photo", true), users.updateProfileImage);
router.delete("/delete_profile_image/delete", users.deleteProfileImage); 
router.put("/update_firebase_id", users.updateFirebaseIdByEmail);
router.put("/update/:user_id", users.update);
router.put("/verified/:firebase_id", users.verifiedOrUnverifiedUser);
router.get("/", users.findAll);
router.get("/companies/featured", users.findAllBusiness);
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