'use strict';

require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk-mock');

const app = require('../app.js');

describe('HTML Render', function () {

  it('it should succeed with an s3 url', async function () {
    this.timeout(10000);
    process.env.BUCKET = 'test';
    const event = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/mocks/event.json')).toString());
    const response = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/mocks/response.json')).toString());
    const url = JSON.parse(response.body).url;

    AWS.mock('S3', 'upload', (params, callback) => {
      callback(null, "successfully put item in s3");
    });
    AWS.mock('S3', 'getSignedUrl', url);

    try {
      const result = await app.handler(event, context);
      const body = JSON.parse(result.body);
      console.log('body', body);
      expect(result.statusCode).to.be.equals(200);
      expect(body).to.have.property('url');
      expect(body.url).to.equals(url);
    } catch (err) {
      console.error(err)
      throw err
    }
  });
});
