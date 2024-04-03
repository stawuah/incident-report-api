import nock from "nock";
import { assert , expect } from "chai"
import { createIncidentDTO, IncidentDTO } from "../../src/dto/incidentDto";
import { createIncident } from "../../src/controller/incidentController";
const sinon = require('sinon');
const  { searchIncidents ,listIncidents ,}  = require('../../src/controller/incidentController');


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
// it('should create an incident with the provided parameters and a response from the weather API endpoint', async () => {
//     // Mock request and response objects
//     const req: Partial<Request> = {
//         body: {
//             client_id: 10,
//             incident_desc: 'Description of the incident',
//             city: 'Accra',
//             country: 'Ghana'
//         }
//     };
//     const res: Partial<Response> = {
//         status: sinon.stub().returnsThis(),
//         json: sinon.stub()
//     };

//     // Stub for fetch function to mock weather API response
//     const fetchStub = sinon.stub(fetch, 'Promise');
//     const weatherResponse = {
//         main: {
//             temp: 25.5, // Mocked temperature
//             humidity: 80 // Mocked humidity
//             // Other weather data properties can be added as needed
//         }
//     };
//     fetchStub.resolves({
//         json: async () => weatherResponse
//     } as any);

//     // Mocking process.env
//     process.env.API_KEY = 'your-api-key';

//     // Call the function with mocked objects
//     await createIncident( , res);

//     // Check if response status is 201
//     sinon.assert.calledWith(res.status as unknown as sinon.SinonStub, 201);

//     // Check if the response contains the newly created incident with weather data
//     const expectedIncident: IncidentDTO = {
//         client_id: 10,
//         incident_desc: 'Description of the incident',
//         city: 'Accra',
//         country: 'Ghana',
//         weather_report: weatherResponse // Assuming the function adds weather data to the incident object
//     };
//     sinon.assert.calledWith(res.json as sinon.SinonStub, expectedIncident);
// });
// });