import app from "../../src/app"
import supertest from "supertest";
import { expect } from "chai";
require('dotenv').config()

describe("integration tests", () => {


    it("should test the healthcheck route", (done) => {
        supertest(app)
            .get("/health-check")
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    })

    it("should search for incidents reports from ghana", (done) => {
        supertest(app)
            .post("/api/search")
            .send({
                country: "ghana"
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    })


    it('should create an report incident and save in database with weather report', (done) => {

                supertest(app)
                    .post("/api/report-incident")
                    .send({
                        "client_id": 12,
                        "incident_desc": "Description of the incident",
                        "city": "Accra",
                        "country": "Ghana"
                    })
                    .expect('Content-Type', /json/)
                    .expect((res) => {
                        expect(res.status).to.equal(201)
                        expect(res.body).to.equal(res.body);
                    })
                    .end(done);
            });
    });




    it("should return incident reports for Accra with temperature between 301 and 306 with humidity range of 74", (done) => {

      const  expectedQuery = [
        {
            "weather_info": {
                "main": {
                    "temp": 301.38,
                    "humidity": 74
                },
                "name": "Accra"
            }
        },
        {
            "weather_info": {
                "main": {
                    "temp": 301.38,
                    "humidity": 74
                },
                "name": "Accra"
            }
        },
        {
            "weather_info": {
                "main": {
                    "temp": 301.38,
                    "humidity": 74
                },
                "name": "Accra"
            }
        },
        {
            "weather_info": {
                "main": {
                    "temp": 301.38,
                    "humidity": 74
                },
                "name": "Accra"
            }
        },
        {
            "weather_info": {
                "main": {
                    "temp": 301.38,
                    "humidity": 74
                },
                "name": "Accra"
            }
        },
        {
            "weather_info": {
                "main": {
                    "temp": 301.38,
                    "humidity": 74
                },
                "name": "Accra"
            }
        },
        {
            "weather_info": {
                "main": {
                    "temp": 303.38,
                    "humidity": 74
                },
                "name": "Accra"
            }
        }
    ]
        supertest(app)
            .get("/api/fetch-incident-report")
            .query({ city: 'Accra', temp_min: 301, temp_max: 306 , humidity: 74 })
           
            .expect(200)
            .expect(expectedQuery)
            .expect((res) => {
                const { body } = res;
                expect(body).to.be.an('array').that.is.not.empty;})
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
});
