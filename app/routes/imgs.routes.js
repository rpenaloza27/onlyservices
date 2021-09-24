const categories = require("../controllers/categories.controller");
var router = require("express").Router();

// Create a new Tutorial
// router.post("/", tutorials.create);
const fs= require("fs");
const { formatWithOptions } = require("util");
// Retrieve all Tutorials
router.get("/:path", (req, res)=>{
    const path= req.params.path;
    const format = path.substring(path.lastIndexOf('.')+1, path.length) || path
    const formatWithoutDot = path.replace(".", "");
    const filePath = `${__dirname}/public/imgs/${path}`; 
    // or any file format

    // Check if file specified by the filePath exists
    fs.stat(filePath, function (exists) {
        if (exists) {
            // Content-type is very interesting part that guarantee that
            // Web browser will handle response in an appropriate manner.
            res.writeHead(200, {
                "Content-Type": `image/${formatWithOptions}`,
                "Content-Disposition": "attachment; filename=" + path
            });
            fs.createReadStream(filePath).pipe(res);
            return;
        }
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("ERROR File does not exist");
    });
});


// Retrieve all published Tutorials
// router.get("/published", tutorials.findAllPublished);

// Retrieve a single Tutorial with id
// router.get("/:id", tutorials.findOne);

// Update a Tutorial with id
// router.puaeaet("/:id", tutorials.update);

// // Delete a Tutorial with id
// router.delete("/:id", tutorials.delete);

// // Delete all Tutorials
// router.delete("/", tutorials.deleteAll);

module.exports = router;
