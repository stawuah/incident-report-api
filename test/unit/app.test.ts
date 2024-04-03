
import { assert } from "chai"
const sinon = require('sinon');
const  { searchIncidents ,listIncidents }  = require('../../src/controller/incidentController');

type statusCode = {
	code : number
};

describe('searchIncidents', () => {
  let req: { body: any; };
  let res: { status: (code: number) => statusCode, json: any; };

  beforeEach(() => {
    // Mocking the request and response objects
    req = {
      body: {
        country: 'TestCountry'
      }
    };
    res  = {
      status: sinon.stub().returnsThis() as (code: number) => statusCode,
      json: sinon.stub()
    };

  });

  afterEach(() => {
    sinon.restore(); // Restore the stubbed methods
  });

  it('should return an error if country parameter is missing', async () => {
    req.body.country = undefined;

    // Call the function with the mocked objects
    await searchIncidents(req, res);

    // Assertions
    assert.ok(res.status(422))
    assert.ok(res.json.calledWith({ error: 'Country parameter is required' }));
  });


  it('should return 422 status and error message if country parameter is missing', async () => {
    const req = { body: {} };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
    };

    await searchIncidents(req, res);

    assert(res.status.calledWith(422));
    assert(res.json.calledWith({ error: 'Country parameter is required' }));
});

});

  describe('listIncidents function', () => {

  it('should return 500 status and error message if an internal server error occurs', async () => {
      const req = { query: {} };
      const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
      };

      // Mock the behavior of db.query to throw an error
      const dbMock = {
          query: sinon.stub().throws(new Error('Database error'))
      };

      // Inject the mocked db object
      await listIncidents(req, res, dbMock);

      assert(res.status.calledWith(500));
      assert(res.json.calledWith({ error: 'Internal Server Error' }));
  });

});



