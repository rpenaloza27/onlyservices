const enviroment = require("../../environment/enviroment");

const resolveUrl = (filename) =>{
    return !enviroment.production ? 'http://localhost:3000/imgs/'+ filename: 'http://157.245.112.96/imgs/'+filename
}

module.exports = {
    resolveUrl
}