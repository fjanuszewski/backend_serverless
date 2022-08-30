const AWSXRay = require('aws-xray-sdk')
const {responseHandler} = require('/opt/nodejs/commons')
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient,PutCommand} = require('@aws-sdk/lib-dynamodb');

const updateItem = async (item) => {
  const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
  const dynamodbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);
  try {
    const result = await dynamodbDocumentClient.send(
      new PutCommand({
        TableName: process.env.EXAMPLE_TABLE,
        Item: item,
        ConditionExpression: 'attribute_exists(idItem)'
      })
    );
    return result;
  } catch (err) {
    return err
  }
};


exports.handler = async (event) => {
  console.log('START', JSON.stringify(event));
  try {
    const { pathParameters: { idItem }, body: description } = event;

    AWSXRay.captureFunc('annotations', function (subsegment) {
      subsegment.addAnnotation('idItem', idItem);
    });

    if (!description)
      return responseHandler({ response: { status: 400, data: { message: 'Invalid request body. Missing description data.' } } });

    const item = {idItem,description}
    const res = await updateItem(item);
    return responseHandler(null, res);
  } catch (error) {
    console.log(error);
    return responseHandler({
      response: error || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};
