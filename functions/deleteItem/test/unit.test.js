'use strict';

require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk-mock');

const app = require('../app.js');

describe('HTML DELETE Template', function () {

  beforeEach(() => {
    AWS.restore();
  });

  it('it should delete a template from dynamo', async function () {
    this.timeout(10000);
    const event = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/mocks/event.json')).toString());

    AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
      callback(null, {});
    });

    try {
      const result = await app.handler(event, context);
      expect(result.statusCode).to.be.equals(204);
    } catch (err) {
      console.error(err)
      throw err
    }
  });

  it('it should receive 404 due to template not found', async function () {
    this.timeout(10000);
    const event = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/mocks/event.json')).toString());

    AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
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
