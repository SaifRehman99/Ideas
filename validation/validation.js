const joi = require("joi");

const registerValidation = data => {
    const schema = {
        name: joi
            .string()
            .min(5)
            .max(10)
            .required(),
        email: joi
            .string()
            .min(5)
            .email()
            .required(),
        password: joi
            .string()
            .min(6)
            .max(100)
            .required(),
        cpassword: joi
            .any()
            .valid(joi.ref("password"))
            .required()
    };

    return joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;