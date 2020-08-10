const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const responseFactory = (error, result) => ({
  statusCode: (error) ? error.response.status : 200,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: (error) ? JSON.stringify(error.response.data) : JSON.stringify(result)
});

const createItem = (idItem, description) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.EXAMPLE_TABLE,
      Item: {
        idItem,
        description
      }
    };
    documentClient.put(params, (err, data) => {
      if (err)
        return reject(err);
      resolve(params.Item);
    });
  });
}

exports.handler = async (event) => {
  console.log('START', JSON.stringify(event));
  try {
    const { queryStringParameters: { idItem }, body: description } = event;

    if (!description)
      return responseFactory({ response: { status: 400, data: { message: 'Invalid request body. Missing description data.' }}});

    const res = await createItem(idItem, description);
    return responseFactory(null, res);
  } catch (error) {
    console.log(error);
    return responseFactory({
      response: error.response || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};
