const AWSXRay = require('aws-xray-sdk')
const {responseHandler} = require('/opt/nodejs/commons')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const deleteItem = async (idItem) => {
  const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
  const dynamodbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);
  try {
      const result = await dynamodbDocumentClient.send(
        new DeleteCommand({
          TableName: process.env.EXAMPLE_TABLE,
          Key: { idItem },
          ConditionExpression: 'attribute_exists(idItem)',
        })
      );
      return result;
    } catch (err) {
      return err
    }
  };

exports.handler = async (event) => {
  console.log('START =>', JSON.stringify(event));

  AWSXRay.captureFunc('annotations', function(subsegment) {
    subsegment.addAnnotation('idItem', event.pathParameters.idItem);
  });
  const idItem =event.pathParameters.idItem.toString()
  try {
    const res = await deleteItem(idItem);
    return responseHandler(null, res);
  } catch (error) {
    console.error(error);
    return responseHandler({
      response: error || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};