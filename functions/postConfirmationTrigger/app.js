const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const log = require('lambda-log');

exports.handler = async (event, context, callback) => {
    log.options.debug = process.env.DEBUG === 'true';
    log.debug(event);
    let attributes = event.request.userAttributes
    try {
        await createItem(attributes);
        callback(null, event);
    } catch (error) {
        log.error(error);
        callback(null, event);
    }
};


const createItem = (attributes) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: process.env.TABLE_EMPLOYEE,
            Item: {
                email: attributes.email
            }
        };
        documentClient.put(params, (err) => {
            if (err)
                return reject(err);
            resolve(params.Item);
        });
    });
}