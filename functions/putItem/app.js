const AWS = require('aws-sdk');


const responseFactory = (error, result) => ({
  statusCode: (error) ? error.response.status : 200,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: (error) ? JSON.stringify(error.response.data) : JSON.stringify(result)
});

const updateItem = (idItem, description) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  return new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.EXAMPLE_TABLE,
      Key: { idItem },
      UpdateExpression: 'set description = :description',
      ExpressionAttributeValues: { ':description': description },
      ConditionExpression: 'attribute_exists(idItem)',
      ReturnValues: 'ALL_NEW'
    };
    documentClient.update(params, (err, data) => {
      if (err)
        return reject(err);
      if (!data)
        return reject({ response: { status: 404, data: { message: 'idItem not found.' } } })
      resolve(data.Attributes);
    });
  });
}

exports.handler = async (event) => {
  console.log('START', JSON.stringify(event));
  try {
    const { pathParameters: { idItem }, body: description } = event;

    if (!description)
      return responseFactory({ response: { status: 400, data: { message: 'Invalid request body. Missing description data.' } } });

    const res = await updateItem(idItem, description);
    return responseFactory(null, res);
  } catch (error) {
    console.log(error);
    return responseFactory({
      response: error.response || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};
