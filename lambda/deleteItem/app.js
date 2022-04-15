const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

const responseFactory = (error, result) => ({
  statusCode: (error) ? error.response.status : 200,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: (error) ? JSON.stringify(error.response.data) : JSON.stringify(result)
});

const deleteItem = (idItem) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  return new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.EXAMPLE_TABLE,
      Key: { idItem },
      ConditionExpression: 'attribute_exists(idItem)'
    };
    documentClient.delete(params, (err, data) => {
      if (err)
        return reject(err);
      if (!data)
        return reject({ response: { status: 404, data: { message: 'idItem not found.' } } });
      resolve(data);
    });
  });
}

exports.handler = async (event) => {
  console.log('START =>', JSON.stringify(event));
  try {
    await deleteItem(event.pathParameters.idItem);
    return responseFactory({ response: { status: 204, data: {} } });
  } catch (error) {
    console.log(error);
    return responseFactory({
      response: error.response || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};