module.exports = {
    ERRORS:{
        EMPTY_PARAMS: 'MISSING PARAMS',
        SCHEMA:{
            'string.base': '{{#label}} must be a string',
            'string.empty': '{{#label}} cannot be an empty field',
            'string.min': '{{#label}} should have a minimum length of {#limit}',
            'string.max': '{{#label}} should have a max length of {#limit}',
            'any.required': '{{#label}} is a required field',
            'number.min': '{{#label}} should have a minimum length of {#limit}',
            'number.max': '{{#label}} should have a max length of {#limit}',
        }
    }
}