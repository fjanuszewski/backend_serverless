const lodash = require('lodash');
const Dictionary = require('./dictionaries/dictionaryService');
const dictionaryError = getDictionary('error');
const dictionaryErrorSchema = require('./dictionaries/dictionaryErrorSchema')
const log = require('lambda-log');
const Joi = require('joi');
const datadogTag = 'DATADOG_EVENT';
const OrderEntity = require('./entities/orderEntity')
const PaymentEntity = require('./entities/paymentEntity')


function responseFactory(data, status = null) {
  const response = {
    statusCode: status ? status : lodash.isEmpty(data) ? 204 : 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    body: data,
    isBase64Encoded: false
  }

  if (lodash.toNumber(response.statusCode) < 400) {
    log.info('[RESPONSE]', { response: Object.assign(response, { body: '****' }) }, [datadogTag]);
  } else {
    log.error('[RESPONSE_ERROR]', response, [datadogTag]);
  }

  return Object.assign(response, { body: JSON.stringify(data) });
}

function errorFactory(error) {
  log.error('[ERROR]', error,[datadogTag]);
  const errorKey = typeof error === 'string' ? error : error.errorMessage;
  let errorResponse = dictionaryError.getValue(errorKey);

  if (!errorResponse) {
    log.error('[ERROR]', error);
    errorResponse = dictionaryError.getValue('default');
  }

  if (error.errorValue) {
    errorResponse.body.error.message = `${errorResponse.body.error.message}: ${error.errorValue}`
  }

  return responseFactory(errorResponse.body, errorResponse.statusCode);
}

function getDictionary(dictionary) {
  return new Dictionary(dictionary);
}
const responseHandler = (data = null, status = null) => {
  console.log('data responseHandler::', data);

  if (status === 204 || status === 200 || status === 201) {
    return {
      statusCode: status,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data),
      'isBase64Encoded': false
    }
  }

  return {
    statusCode: status ? status : 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: data ? JSON.stringify(data) : status,
    'isBase64Encoded': false
  }
}

const orderSchema = Joi.object({
  lastName: Joi.string().min(1).max(50).required(),
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().regex(/^[_a-zA-Z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).required(),
  phone: Joi.number().min(100000).max(999999999999999).required(),
  phoneAreaCode: Joi.number().min(1).max(999999).required(),
  deliveryState: Joi.string().required(),
  deliveryLocation: Joi.string().required(),
  deliveryStreet: Joi.string().required(),
  deliveryHouseNumber: Joi.string().required(),
  deliveryFloorNumber: Joi.string().allow(null, ''),
  deliveryDoorNumber: Joi.string().allow(null, ''),
  deliveryComment: Joi.string().allow(null, ''),
  deliveryZipCode: Joi.string().required(),
  productId: Joi.number().min(1).required(),
  quantity: Joi.number().min(1).max(50).required(),
  socialNumber: Joi.string().required(),
}).messages(dictionaryErrorSchema.ERRORS.SCHEMA).unknown(true);


module.exports = {
  responseHandler, //TODO REEMPLAZAR ESTO POR LOS FACTORY NUESTROS
  getDictionary,
  errorFactory,
  responseFactory,
  lodash,
  log,
  orderSchema,
  OrderEntity,
  PaymentEntity
};
