const { companies, payment_types } = require("../models");
const db = require("../models");
const categories_services = db.categories_services;
const services = db.services;
const user = db.users;
const people = db.people;
const user_services_favorites = db.user_services_favorites;
const categories = db.categories;
const Op = db.Sequelize.Op;
const service_images = db.service_images;
const { getPagination, getPagingData } = require("../services/pagination.service");
const service_comments = db.service_comments;
const services_cities = db.services_cities;
const municipios = db.municipios;




// Create and Save a new Tutorial
exports.create = (req, res) => {

};

// Retrieve all Tutorials from the database.
exports.findServicesByCategories = (req, res) => {

    if (req.params.category_id) {
        let { page, size, minimum, maximum } = req.query;
        const { limit, offset } = getPagination(page, size);
        let city_id = 0;
        if (req.query.city_id) {
            city_id = req.query.city_id
        }

        if (city_id == 0 || req.params.category_id == 20) {
            let object_options={
                limit,
                offset,
                where: { category_id: Number(req.params.category_id), },
                include: {
                    model: services,
                    include: [
                        { model: payment_types,as: 'Payment_Type', },
                        { model: service_images, paranoid: false },
                        { model: user, include: [{model:people},{model:companies}] },
                        { model: user_services_favorites },
                        {
                            model: service_comments,
                            include: { model: user, include: people }
                        },
                        {
                            model: services_cities, include:
                            {
                                model: municipios,
                            }
                        }
                    ],
                    order: [
                        [{ model: user }, 'priority', 'asc']
                    ],

                }, attributes: { exclude: ['createdAt'] },

            }
            categories_services.findAndCountAll(object_options)
                .then(data => {
                    console.log("Datos", data)
                    const response = getPagingData(data, page, limit, req);
                    if (data.rows.length > 0) {
                        res.send({
                            success: true,
                            data: response,
                            message: "Lista de servivios "
                        });
                    } else {
                        res.status(400).send({
                            success: true,
                            data: response,
                            message: "No hay servicios "
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving tutorials."
                    });
                });
        } else {
            categories_services.findAndCountAll({
                limit,
                offset,
                where: { category_id: req.params.category_id, },
                include: {
                    model: services,
                    include: [
                        { model: payment_types,as: 'Payment_Type', },
                        { model: service_images, paranoid: false },
                        { model: user, include: [{ model: people }, { model: companies }] },
                        { model: user_services_favorites },
                        {
                            model: service_comments,
                            include: { model: user, include: people }
                        },
                        {
                            model: services_cities, include:
                            {
                                model: municipios,
                            }, where: {
                                [Op.or]: [
                                    { city_id: req.query.city_id },
                                ],
                            }
                        }
                    ],
                    order: [
                        [{ model: user }, 'priority', 'asc']
                    ],
                    where: { status: 1 }

                }, attributes: { exclude: ['createdAt'] },

            })
                .then(data => {
                    console.log("Datos", data)
                    const response = getPagingData(data, page, limit, req);
                    if (data.rows.length > 0) {
                        res.send({
                            success: true,
                            data: response,
                            message: "Lista de servivios "
                        });
                    } else {
                        res.status(400).send({
                            success: true,
                            data: response,
                            message: "No hay servicios "
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving tutorials."
                    });
                });
        }

    }

};

exports.findServicesByCategoriesSearch = (req, res) => {

    if (req.params.category_id) {
        let { page, size, minimum, maximum } = req.query;
        const { limit, offset } = getPagination(page, size);

        let city_id = 0;
        if (req.query.city_id) {
            city_id = req.query.city_id
        }
        minimum = minimum ? Number(minimum) : 0
        maximum = maximum ? Number(maximum) : 0
        console.log("Maximum", maximum);
        let t = ""
        if (city_id == 0 || req.params.category_id == 20) {
            let object_options={
                limit,
                offset,
                where: { category_id: Number(req.params.category_id), },
                include: {
                    model: services,
                    include: [
                        { model: payment_types,as: 'Payment_Type', },
                        { model: service_images, paranoid: false },
                        { model: user, include: [{model:people},{model:companies}] },
                        { model: user_services_favorites },
                        {
                            model: service_comments,
                            include: { model: user, include: [{model:people},{model:companies}] }
                        },
                        {
                            model: services_cities, include:
                            {
                                model: municipios,
                            }
                        }
                    ],
                    order: [
                        [{ model: user }, 'priority', 'asc']
                    ],
                    where: {
                        status: 1,
                        [Op.or]: [
                            { name: { [Op.substring]: req.query.search } },
                            { long_description: { [Op.substring]: req.query.search } },
                            { short_description: { [Op.substring]: req.query.search } },
                        ]
                    }

                }, attributes: { exclude: ['createdAt'] },

            }
            let object_with_filters;
            if (typeof minimum != 'undefined' && minimum > 0) {
                t="Minimum"
                if (typeof maximum != 'undefined' && maximum > 0) {
                    t="Minimum and maximum"
                    //Both Prices Filters
                    object_with_filters= {
                        limit,
                        offset,
                        where: { category_id: Number(req.params.category_id), },
                        include: {
                            model: services,
                            include: [
                                { model: payment_types,as: 'Payment_Type', },
                                { model: service_images, paranoid: false },
                                { model: user, include: [{model:people},{model:companies}] },
                                { model: user_services_favorites },
                                {
                                    model: service_comments,
                                    include: { model: user, include: [{model:people},{model:companies}] }
                                },
                                {
                                    model: services_cities, include:
                                    {
                                        model: municipios,
                                    }
                                }
                            ],
                            order: [
                                [{ model: user }, 'priority', 'asc']
                            ],
                            where: {
                                status: 1,
                                [Op.or]: [
                                    { name: { [Op.substring]: req.query.search } },
                                    { long_description: { [Op.substring]: req.query.search } },
                                    { short_description: { [Op.substring]: req.query.search } },
                                    
                                ],
                                price: { [Op.between]: [minimum, maximum] } 
                            }
        
                        }, attributes: { exclude: ['createdAt'] },
        
                    }
                }else{
                    //Only minimum
                    object_with_filters= {
                        limit,
                        offset,
                        where: { category_id: Number(req.params.category_id), },
                        include: {
                            model: services,
                            include: [
                                { model: payment_types,as: 'Payment_Type', },
                                { model: service_images, paranoid: false },
                                { model: user, include: [{model:people},{model:companies}] },
                                { model: user_services_favorites },
                                {
                                    model: service_comments,
                                    include: { model: user, include: [{model:people},{model:companies}] }
                                },
                                {
                                    model: services_cities, include:
                                    {
                                        model: municipios,
                                    }
                                }
                            ],
                            order: [
                                [{ model: user }, 'priority', 'asc']
                            ],
                            where: {
                                status: 1,
                                [Op.or]: [
                                    { name: { [Op.substring]: req.query.search } },
                                    { long_description: { [Op.substring]: req.query.search } },
                                    { short_description: { [Op.substring]: req.query.search } },
                                ],
                                price: { [Op.gte]: minimum, }
                            }
        
                        }, attributes: { exclude: ['createdAt'] },
        
                    }
                }
            }else{
                //Maximum only
                t="Maximum"
                if (typeof maximum != 'undefined' && maximum > 0) {
                    object_with_filters= {
                        limit,
                        offset,
                        where: { category_id: Number(req.params.category_id), },
                        include: {
                            model: services,
                            include: [
                                { model: payment_types,as: 'Payment_Type', },
                                { model: service_images, paranoid: false },
                                { model: user, include: [{model:people},{model:companies}] },
                                { model: user_services_favorites },
                                {
                                    model: service_comments,
                                    include: { model: user, include: [{model:people},{model:companies}] }
                                },
                                {
                                    model: services_cities, include:
                                    {
                                        model: municipios,
                                    }
                                }
                            ],
                            order: [
                                [{ model: user }, 'priority', 'asc']
                            ],
                            where: {
                                status: 1,
                                [Op.or]: [
                                    { name: { [Op.substring]: req.query.search } },
                                    { long_description: { [Op.substring]: req.query.search } },
                                    { short_description: { [Op.substring]: req.query.search } },
                                ],
                                 price: { [Op.lte]: maximum, } 
                            }
        
                        }, attributes: { exclude: ['createdAt'] },
        
                    } 
                }else{
                    t="Non filters"
                    //None price filters
                    object_with_filters=object_options;
                }
            }
            console.log("Filters",object_with_filters);
            categories_services.findAndCountAll(object_with_filters)
                .then(data => {
                    console.log("Datos", data)
                    const response = getPagingData(data, page, limit, req);
                    if (data.rows.length > 0) {
                        res.send({
                            success: true,
                            data: response,
                            message: "Lista de servivios ",
                            t,
                            query:req.query
                        });
                    } else {
                        res.status(400).send({
                            success: false,
                            data: req.query,
                            message: "No hay servicios "
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving tutorials."
                    });
                });
        } else {
            let object_options={
                limit,
                offset,
                where: { category_id: req.params.category_id, },
                include: {
                    model: services,
                    include: [
                        { model: service_images, paranoid: false },
                        { model: user, include: [{model:people},{model:companies}] },
                        { model: user_services_favorites },
                        {
                            model: service_comments,
                            include: { model: user, include: [{model:people},{model:companies}] }
                        },
                        {
                            model: services_cities, include:
                            {
                                model: municipios,
                            }, where: {
                                [Op.or]: [
                                    { city_id: req.query.city_id },
                                ],
                            }
                        }
                    ],
                    order: [
                        [{ model: user }, 'priority', 'asc']
                    ],
                    where: {
                        status: 1,
                        [Op.or]: [
                            { name: { [Op.substring]: req.query.search } },
                            { long_description: { [Op.substring]: req.query.search } },
                            { short_description: { [Op.substring]: req.query.search } },
                        ]
                    }

                }, attributes: { exclude: ['createdAt'] },

            };
            let object_with_filters;
            if (typeof minimum != 'undefined' && minimum > 0) {
                if (typeof maximum != 'undefined' && maximum > 0) {
                    object_with_filters={
                        limit,
                        offset,
                        where: { category_id: req.params.category_id, },
                        include: {
                            model: services,
                            include: [
                                { model: service_images, paranoid: false },
                                { model: user, include: [{model:people},{model:companies}] },
                                { model: user_services_favorites },
                                {
                                    model: service_comments,
                                    include: { model: user, include: [{model:people},{model:companies}] }
                                },
                                {
                                    model: services_cities, include:
                                    {
                                        model: municipios,
                                    }, where: {
                                        [Op.or]: [
                                            { city_id: req.query.city_id },
                                        ],
                                    }
                                }
                            ],
                            order: [
                                [{ model: user }, 'priority', 'asc']
                            ],
                            where: {
                                status: 1,
                                [Op.or]: [
                                    { name: { [Op.substring]: req.query.search } },
                                    { long_description: { [Op.substring]: req.query.search } },
                                    { short_description: { [Op.substring]: req.query.search } },
                                ],
                                price: { [Op.between]: [minimum, maximum] }
                            }
        
                        }, attributes: { exclude: ['createdAt'] },
        
                    };
                }else{
                    object_with_filters={
                        limit,
                        offset,
                        where: { category_id: req.params.category_id, },
                        include: {
                            model: services,
                            include: [
                                { model: service_images, paranoid: false },
                                { model: user, include: [{model:people},{model:companies}] },
                                { model: user_services_favorites },
                                {
                                    model: service_comments,
                                    include: { model: user, include: [{model:people},{model:companies}] }
                                },
                                {
                                    model: services_cities, include:
                                    {
                                        model: municipios,
                                    }, where: {
                                        [Op.or]: [
                                            { city_id: req.query.city_id },
                                        ],
                                    }
                                }
                            ],
                            order: [
                                [{ model: user }, 'priority', 'asc']
                            ],
                            where: {
                                status: 1,
                                [Op.or]: [
                                    { name: { [Op.substring]: req.query.search } },
                                    { long_description: { [Op.substring]: req.query.search } },
                                    { short_description: { [Op.substring]: req.query.search } },
                                ],
                                price: { [Op.gte]: minimum, }
                            }
        
                        }, attributes: { exclude: ['createdAt'] },
        
                    };
                }
            }else{
                if (typeof maximum != 'undefined' && maximum > 0) {
                    object_with_filters={
                        limit,
                        offset,
                        where: { category_id: req.params.category_id, },
                        include: {
                            model: services,
                            include: [
                                { model: service_images, paranoid: false },
                                { model: user, include: [{model:people},{model:companies}] },
                                { model: user_services_favorites },
                                {
                                    model: service_comments,
                                    include: { model: user, include: [{model:people},{model:companies}] }
                                },
                                {
                                    model: services_cities, include:
                                    {
                                        model: municipios,
                                    }, where: {
                                        [Op.or]: [
                                            { city_id: req.query.city_id },
                                        ],
                                    }
                                }
                            ],
                            order: [
                                [{ model: user }, 'priority', 'asc']
                            ],
                            where: {
                                status: 1,
                                [Op.or]: [
                                    { name: { [Op.substring]: req.query.search } },
                                    { long_description: { [Op.substring]: req.query.search } },
                                    { short_description: { [Op.substring]: req.query.search } },
                                ],
                                price: { [Op.lte]: maximum, }
                            }
        
                        }, attributes: { exclude: ['createdAt'] },
        
                    };
                }else{
                    object_with_filters=object_options;
                }
            }
            console.log("Filters 2", object_with_filters)
            categories_services.findAndCountAll(object_with_filters)
                .then(data => {
                    console.log("Datos", data)
                    const response = getPagingData(data, page, limit, req);
                    if (data.rows.length > 0) {
                        res.send({
                            success: true,
                            data: response,
                            message: "Lista de servivios "
                        });
                    } else {
                        res.status(400).send({
                            success: true,
                            data: response,
                            message: "No hay servicios "
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving tutorials."
                    });
                });
        }

    }

};



//find Services by categories
exports.findByCategory = (req, res) => {

    services.findAll()
        .then(data => {
            if (data.length > 0) {
                res.send({
                    success: true,
                    data,
                    message: "Lista de servivios "
                });
            } else {
                res.status(400).send({
                    success: true,
                    data,
                    message: "No hay servicios "
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
}

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};