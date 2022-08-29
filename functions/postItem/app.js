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

    AWSXRay.captureFunc('annotations', function(subsegment) {
      subsegment.addAnnotation('idItem', item.idItem);
    });

    if (!item.description && !item.idItem)
      return responseHandler({ response: { status: 400, data: { message: 'Invalid request body. Missing description data.' }}});
    
    item.idItem = item.idItem.toString()
    const res = await createItem(item);
    return responseHandler(null, res);
  } catch (error) {
    console.error("ERROR: ",error);
    return responseHandler({
      response: error.response || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};
