
const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

const responseFactory = (error, result) => ({
  statusCode: (error) ? error.response.status : 200,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: (error) ? JSON.stringify(error.response.data) : JSON.stringify(result)
});

const getItem = (idItem) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  return new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.EXAMPLE_TABLE,
      Key: {
        idItem
      }
    };
    documentClient.get(params, (err, data) => {
      if (err)
        return reject(err);
      if (!data.Item)
        return reject({ response: { status: 404, data: { message: 'idItem not found.' } } });
      resolve(data.Item);
    });
  });
}

exports.handler = async (event) => {
  console.log('START =>', JSON.stringify(event));
  try {
    const res = await getItem(event.pathParameters.idItem);
    return responseFactory(null, res);
  } catch (error) {
    console.log(error);
    return responseFactory({
      response: error.response || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};