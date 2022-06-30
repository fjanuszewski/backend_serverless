/* eslint-disable no-undef */
'use strict';
const utils = require('../utils');

describe('Utils Layer', function() {
  beforeAll(async () => {});
  afterAll(async () => {});
  it('responseFactory', async function() {
    expect(utils.responseFactory).toBeDefined();
    const error = utils.responseFactory();
    expect(error).toHaveProperty('statusCode', 204);
  });

  it('responseFactory', async function() {
    expect(utils.errorFactory).toBeDefined();
    const error = utils.errorFactory(new Error());
    expect(error).toHaveProperty('statusCode', 500);
    expect(error.body).toEqual(
      '{"error":{"code":"internal-error","message":"Hubo un error no identificado"}}'
    );
  });
});
