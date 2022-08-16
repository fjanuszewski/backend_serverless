// const AWSXRay = require('aws-xray-sdk')
// const AWS = AWSXRay.captureAWS(require('aws-sdk'))

// const documentClient = new AWS.DynamoDB.DocumentClient();

// const responseFactory = (error, result) => ({
//   statusCode: (error) ? error.response.status : 200,
//   headers: { 'Access-Control-Allow-Origin': '*' },
//   body: (error) ? JSON.stringify(error.response.data) : JSON.stringify(result)
// });

// const createItem = (idItem, description) => {
//   return new Promise((resolve, reject) => {
//     const params = {
//       TableName: process.env.EXAMPLE_TABLE,
//       Item: {
//         idItem,
//         description
//       }
//     };
//     documentClient.put(params, (err, data) => {
//       if (err)
//         return reject(err);
//       resolve(params.Item);
//     });
//   });
// }


const AWSXRay = require('aws-xray-sdk')
const {responseHandler} = require('/opt/nodejs/commons')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const createItem = async (item) => {
  const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
  const dynamodbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

  try {
    const result = await dynamodbDocumentClient.send(
      new PutCommand({
        TableName: process.env.EXAMPLE_TABLE,
        Item: item,
        ConditionExpression: 'attribute_not_exists(accountId)'
      })
    );
    return result
  } catch (error) {
    throw error;
  }
};

exports.handler = async (event) => {
  console.log('START', JSON.stringify(event));
  try {
    const item = JSON.parse(event.body);

    if (!item.description && !item.idItem)
      return responseHandler({ response: { status: 400, data: { message: 'Invalid request body. Missing description data.' }}});

    const res = await createItem(item);
    return responseHandler(null, res);
  } catch (error) {
    console.log(error);
    return responseHandler({
      response: error.response || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};
