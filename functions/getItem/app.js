
const AWSXRay = require('aws-xray-sdk')
const {responseHandler} = require('/opt/nodejs/commons')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const getItem = async (idItem) => {
  const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
  const dynamodbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

  try {
    const result = await dynamodbDocumentClient.send(
      new GetCommand({
        TableName: process.env.EXAMPLE_TABLE,
        Key: { idItem },
      })
    );
    if (!result.Item)
      throw({ response: { status: 404, data: { message: 'idItem not found.' } } });
    
    return result.Item;
  } catch (error) {
    throw error;
  }
};

exports.handler = async (event) => {
  console.log('START =>', JSON.stringify(event));

  AWSXRay.captureFunc('annotations', function(subsegment) {
    subsegment.addAnnotation('idItem', event.pathParameters.idItem);
  });
  
  try {
    const res = await getItem(event.pathParameters.idItem);
    return responseHandler(null, res);
  } catch (error) {
    console.log(error);
    return responseHandler({
      response: error.response || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};