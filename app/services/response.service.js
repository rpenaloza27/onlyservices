exports.response= (res, options) =>{
    const response = {
        success : options.status ? options.status == 200 : typeof (options.error) == 'undefined',
        data: options.data ? options.data:[],
        message: options.message
    }
    const status = options.status ? options.status : typeof (options.error) == 'undefined'? 200: 400;
    res.status(status).send(response);
}