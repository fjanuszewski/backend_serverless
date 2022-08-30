const AWSXRay = require('aws-xray-sdk')
const {responseHandler} = require('/opt/nodejs/commons')
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient,UpdateCommand} = require('@aws-sdk/lib-dynamodb');

const updateItem = async (item) => {
  const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
  const dynamodbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);
  try {
    const result = await dynamodbDocumentClient.send(
      new UpdateCommand({
        TableName: process.env.EXAMPLE_TABLE,
          Key: {
          idItem: item.idItem,
          },
          UpdateExpression: 'set description = :s_description', // For example, "'set Title = :t, Subtitle = :s'"
          ExpressionAttributeValues: {
            ':s_description': item.description,
          },
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
    const item = {idItem: event.pathParameters.idItem,
                  description: JSON.parse(event.body).description}

    AWSXRay.captureFunc('annotations', function (subsegment) {
      subsegment.addAnnotation('idItem', item.idItem);
    });

    if (!item.description)
      return responseHandler({ response: { status: 400, data: { message: 'Invalid request body. Missing description data.' } } });

    const res = await updateItem(item);
    return responseHandler(null, res);
  } catch (error) {
    console.log(error);
    return responseHandler({
      response: error || { status: 500, data: { message: 'Internal server error.' } }
    });
  }
};
