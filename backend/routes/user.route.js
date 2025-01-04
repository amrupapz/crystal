const express = require('express');
const router = express.Router();
const Joi = require('joi');
const headers = require('../scripts/headers.script');
const user_controller = require('../controllers/user.controller');

const validation_error_response = { response: 400, error: 'Invalid request.' };
const unauthorized_response = { response: 401, error: 'This key is invalid or expired. Are you logged in?' }
const internal_error_response = { response: 500, error: 'Internal error occurred.' };

// GET /
const get_schema = Joi.object().keys({
  user_id: Joi.number().required(),
  token: Joi.string().required()
});

router.get('/', (req, res) => {
  console.log('GET /user');
  console.dir(req.query);

  const { error, value } = get_schema.validate(req.query);
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

  user_controller.get(value.user_id)
    .then(result => {
      console.log(result.user)
      console.log(result.notes);
      const success_response = {
        response: 200,
        user: result.user,
        notes: result.notes,
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

module.exports = router;