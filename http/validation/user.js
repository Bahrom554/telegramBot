const { allow } = require('joi');
const Joi = require('joi');
const CONST = require('../../utils/constants');

const dataValidation = {

    data: Joi.object().keys({
        message: Joi.string().optional().allow(null,''),
        type: Joi.string().required().custom((value, helpers) => {
            if (!CONST.message.type.includes(value)) {
              return helpers.error('any.custom', { message: `Value must be one of the ${!CONST.message.type}` });
            }
            return value; 
          })
    }),




}


module.exports = dataValidation;