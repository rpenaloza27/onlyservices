const environment= require("../../environment/enviroment");

const getPagination = (page,size) => {
    const limit = size ? +size:10;
    console.log("Limit", limit);
    const offset = page? page*limit:0
    return {limit,offset};
} 

const getPagingData =(data,page,limit, req)=>{
    const {count: total,rows} = data;
    const current_page= page ? +page:0;
    const total_pages= Math.ceil(total/limit);
    var next_page = req.protocol + '://' + req.get('host') + req.originalUrl;
    next_page =next_page.replace("page="+page, "page="+(Number(page)+1))
    return {total, rows, total_pages, current_page, next_page};
}

module.exports={
    getPagination,
    getPagingData
}