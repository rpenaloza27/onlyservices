const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan =  require('morgan');

const path = require('path');

const app = express();


app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const routes = require("./app/routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
// const https = require("https");
// const fs = require("fs");
// const options = { 
//   key: fs.readFileSync("my_cert.key"),
//   cert: fs.readFileSync("my_cert.crt")
// }
// const http= require("http");
// http.createServer(app).listen(PORT);

// https.createServer(options,app).listen(443,()=>{
//   console.log("My Server is running")
// })
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
// try{
//    db.sequelize.sync();
// }catch(e){
//   console.log("Err", e, "color: yellow")
// }
