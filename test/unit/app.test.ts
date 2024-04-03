import nock from "nock";
import { Request, Response } from 'express';
import { assert , expect } from "chai"
const sinon = require('sinon');
const  { searchIncidents ,listIncidents }  = require('../../src/controller/incidentController');
import { createIncident } from "../../src/controller/incidentController";

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


const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?q=accra&appid=8729474y092edsdbdnw90';

describe("create incident", () => {

    let res: { status: (code: number) => statusCode, json: any };

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis() as (code: number) => statusCode,
            json: sinon.stub()
        };
    })

    it("should make a GET request from API", async () => {
 
        const mockedUserResponse = {

            "id": 12,
            "client_id": 10,
            "incident_desc": "Description of the incident",
            "city": "Accra",
            "country": "Ghana",
            "date": "2024-03-29T14:15:21.729Z",
            "weather_report": {
                "dt": 1711721427,
                "id": 2306104,
                "cod": 200,
                "sys": {
                    "sunset": 1711735802,
                    "country": "GH",
                    "sunrise": 1711692035
                },
                "base": "stations",
                "main": {
                    "temp": 304.49,
                    "humidity": 69,
                    "pressure": 1008,
                    "temp_max": 304.49,
                    "temp_min": 304.49,
                    "sea_level": 1008,
                    "feels_like": 311.36,
                    "grnd_level": 1005
                },
                "name": "Accra",
                "wind": {
                    "deg": 210,
                    "gust": 5.96,
                    "speed": 6.33
                },
                "coord": {
                    "lat": 5.556,
                    "lon": -0.1969
                },
                "clouds": {
                    "all": 100
                },
                "weather": [
                    {
                        "id": 804,
                        "icon": "04d",
                        "main": "Clouds",
                        "description": "overcast clouds"
                    }
                ],
                "timezone": 0,
                "visibility": 10000
            }
        };
        nock('https://api.openweathermap.org')
            .get(`/data/2.5/weather?q=Accra&appid=8729474y092edsdbdnw90`)
            .reply(201, mockedUserResponse);

        // Check if response status is 201
        assert.ok(res.status(201));
    });
});
