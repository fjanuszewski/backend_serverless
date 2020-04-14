'use strict';

require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk-mock');

const app = require('../app.js');

describe('HTML PUT Template', function () {

  beforeEach(() => {
    AWS.restore();
  });

  it('it should update a template from dynamo', async function () {
    this.timeout(10000);
    const event = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/mocks/event.json')).toString());
    const response = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/mocks/response.json')).toString());

    AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
      callback(null, { Attributes: response });
    });

    try {
      const result = await app.handler(event, context);
      const body = JSON.parse(result.body);
      expect(result.statusCode).to.be.equals(200);
      expect(body).to.have.property('html');
      expect(body.idItem).to.equals('name');
    } catch (err) {
      console.error(err)
      throw err
    }
  });

  it('it should receive 404 due to template not found', async function () {
    this.timeout(10000);
    const event = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/mocks/event.json')).toString());

    AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
      callback(null, null);
    });

    try {
      const result = await app.handler(event, context);
      const body = JSON.parse(result.body);
      expect(result.statusCode).to.be.equals(404);
      expect(body).to.have.property('message');
      expect(body.message).to.equals('idItem not found.');
    } catch (err) {
      console.error(err)
      throw err
    }
  });
});
