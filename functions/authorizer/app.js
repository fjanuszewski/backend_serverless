const AWS = require('aws-sdk');

const getKeyFromDynamo = (key) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  return new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.KEYS_TABLE,
      Key: { key }
    };
    documentClient.get(params, (err, res) => {
      if (err) reject(err);
      resolve(res.Item);
    });
  });
}

const extractTokenFromHeader = (h) => {
  if (h.Authorization && h.Authorization.split(' ')[0] === 'Bearer') {
    return h.Authorization.split(' ')[1];
  } else {
    return h.Authorization;
  }
}

const generatePolicy = (principalId, effect, resource, token) => {
  let authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    let policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    let statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  authResponse.context = {
    token
  };
  return authResponse;
}

exports.handler = async (event, context, callback) => {
  console.log('Start', JSON.stringify(event));

  const token = extractTokenFromHeader(event.headers) || '';
  const key = await getKeyFromDynamo(token);

  if (key)
    callback(null, generatePolicy('user', 'Allow', event.methodArn, token));
  return callback(null, generatePolicy('user', 'Deny', event.methodArn));
};