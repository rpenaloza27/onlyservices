const enviroment = require("../../environment/enviroment");

const resolveUrl = (filename) =>{
    return !enviroment.production ? 'http://localhost:3000/imgs/'+ filename: enviroment.URL+'imgs/'+filename
}

module.exports = {
    resolveUrl
}