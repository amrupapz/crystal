const express = require('express');
const router = express.Router();
const Joi = require('joi');
const headers = require('../scripts/headers.script');
const crypto = require('crypto');

const sphere_controller = require('../controllers/sphere.controller');

const validation_error_response = {response: 400, error: 'Invalid request.'};
const unauthorized_response = {response: 401, error: 'This key is invalid or expired. Are you logged in?'}
const internal_error_response = {response: 500, error: 'Internal error occurred.'};


// POST /create

const create_schema = Joi.object().keys({
    title: Joi.string().required(),
})

router.post('/create', (req, res) => {
    console.log('POST /sphere/create');

    const {error, value} = create_schema.validate(req.body);
    if (error) {
        res.writeHead(400, headers.JSON);
        res.end(JSON.stringify(validation_error_response));
        return;
    }

    // Check if the token is authorized
    if (false) {
        res.writeHead(401, headers.JSON);
        res.end(JSON.stringify(unauthorized_response));
        return;
    }

    sphere_controller.getIndex()
        .then(id => {
            const sphere = {
                title: value.title,
                id: id + 1
            };

            sphere_controller.create(sphere)
                .then(() => {
                    // The request was successful
                    const success_response = {
                        response: 200,
                        sphere: sphere,
                    };
                    res.writeHead(200, headers.JSON);
                    res.end(JSON.stringify(success_response));
                })
                .catch(error => {
                    // An error occurred
                    console.log(error);
                    res.writeHead(500, headers.JSON);
                    res.end(JSON.stringify(internal_error_response));
                });
        })
        .catch(error => {
            console.log(error);
            res.writeHead(500, headers.JSON);
            res.end(JSON.stringify(internal_error_response));
        })
});

router.get('/', (req, res) => {
    console.log('GET /sphere');
    console.dir(req.query);


    // Check if the token is authorized
    if (false) {
        res.writeHead(401, headers.JSON);
        res.end(JSON.stringify(unauthorized_response));
        return;
    }

    sphere_controller.getSpheres()
        .then(result => {
            const success_response = {
                response: 200,
                spheres: result,
                time: Date.now()
            };
            res.writeHead(200, headers.JSON);
            res.end(JSON.stringify(success_response));
        })
        .catch(error => {
            console.log(error);
            res.writeHead(500, headers.JSON);
            res.end(JSON.stringify(internal_error_response));
        });
});



/* GET users listing. */



module.exports = router;