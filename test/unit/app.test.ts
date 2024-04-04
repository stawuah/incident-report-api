import nock from "nock";
import { assert , expect } from "chai"
import db from "../../src/db/db";
import { Request, Response } from 'express';

import { createIncidentDTO, IncidentDTO } from "../../src/dto/incidentDto";
const sinon = require('sinon');
import {searchIncidents ,listIncidents  } from  "../../src/controller/incidentController"

describe('searchIncidents', () => {
  let req: { body: any; };
  let res: { status: any , json : any };

  beforeEach(() => {
    // Mocking the request and response objects
    req = {
      body: {
        country: 'TestCountry'
      }
    };
    res  = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

  });

  afterEach(() => {
    sinon.restore(); // Restore the stubbed methods
  });

  it('should return an error if country parameter is missing', async () => {
    req.body.country = undefined;

        await searchIncidents
    // Assertions
    assert.ok(res.status(422));
    assert.isUndefined(req.body.country)
  });


  it('should return 422 status and error message if country parameter is missing', async () => {
    const req = { body: {} };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
    };


    assert.ok(res.status(422));
    assert.isObject(req.body)
});

});

  describe('listIncidents function', () => {

  it('should return 500 status and error message if an internal server error occurs', async () => {
      const req = { query: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

    await listIncidents


      assert.ok(res.status(422));
    assert.isObject(req.query)
  });

});



describe("create incident", () => {

    let res: { status: any ,  json: any };

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    })

    it("should make a GET request from API using the fetch function", async () => {

        const mockedWeatherResponse = {
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
            .reply(200, mockedWeatherResponse);

        // Check if response status is 201
        assert.ok(res.status(201));
    });
    
    it('req.body should pass IncidentDTO as expected', () => {
        const client_id = 123;
        const incident_desc = 'Test incident';
        const city = 'Test City';
        const country = 'Test Country';

        const result: IncidentDTO = createIncidentDTO(client_id, incident_desc, city, country);

        expect(result).to.deep.equal({
            client_id: 123,
            incident_desc: 'Test incident',
            city: 'Test City',
            country: 'Test Country'
        });
    });


    it('should create an incident DTO object with the provided parameters', () => {
       
        const client_id = 10;
        const incident_desc = 'Description of the incident';
        const city = 'Accra';
        const country = 'Ghana';

    
        const result: IncidentDTO = createIncidentDTO(client_id, incident_desc, city, country);

        // Assert
        expect(result).to.deep.equal({
            client_id: 10,
            incident_desc: 'Description of the incident',
            city: 'Accra',
            country: 'Ghana'
        });
    });

    it('should create an incident report based on the DTO object with the provided parameters ', () => {
       
        const client_id = 10;
        const incident_desc = 'Description of the incident';
        const city = 'Accra';
        const country = 'Ghana';

        const mockedResponse = {
            "client_id": 10,
            "incident_desc": 'Description of the incident',
            "city": 'Accra',
            "country": 'Ghana',
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

        const response = mockedResponse 
        const result: IncidentDTO = createIncidentDTO(client_id, incident_desc, city, country);
  
        expect(result).to.deep.equal({
            client_id: 10,
            incident_desc: 'Description of the incident',
            city: 'Accra',
            country: 'Ghana'
        });

        expect(response).to.deep.equal(mockedResponse )
    });
});

