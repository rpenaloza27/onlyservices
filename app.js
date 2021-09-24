const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan =  require('morgan');

var vhost = require('vhost');

const path = require('path');

const app = express();
const https = require('https');

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


console.log("Dir ", __dirname + '/public')


app.use(morgan('dev'));

const fs = require('fs');
const port = 8443;

var key = fs.readFileSync('./my_cert.key');
var cert = fs.readFileSync('./my_cert.crt');
var options = {
  key: key,
  cert: cert
};


// simple route
app.get("/backend", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


const routes = require("./app/routes")(app);

app.use("/backend",express.static(__dirname + '/public'));

// set port, listen for requests
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// var server = https.createServer(options, app);

// server.listen(port, () => {
//   console.log("server starting on port : " + port)
// });

const db = require("./app/models");
try{
   db.sequelize.authenticate();
}catch(e){
  console.log("Err", e, "color: yellow")
}
