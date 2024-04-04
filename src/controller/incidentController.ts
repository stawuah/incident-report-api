import { Request, Response } from 'express';
import { createIncidentDTO, validateIncidentDTO } from '../dto/incidentDto';
import { Pool } from 'pg';

// A POST endpoint that receives the incident report.
// The endpoint receives the report, adds weather data and stores it in a table “incidents”.
// The weather report should be fetched from the API service of https://openweathermap.org/current

export const createIncident =
	(db: Pool) => async (req: Request, res: Response) => {
		try {
			const { client_id, incident_desc, city, country } = req.body;

			const IncidentDTO = createIncidentDTO(
				client_id,
				incident_desc,
				city,
				country,
			);

			validateIncidentDTO(IncidentDTO);

			const weatherResponse = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`,
			);
			const weatherData = await weatherResponse.json();

			if (!weatherData) {
				return res
					.status(404)
					.json({ error: 'Weather data not found' });
			}

			const currentDate = new Date();

			const query = `
            INSERT INTO incidents (client_id, incident_desc, city, country, date, weather_report)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
			const values = [
				client_id,
				incident_desc,
				city,
				country,
				currentDate,
				JSON.stringify(weatherData),
			];

			const result = await db.query(query, values);
			const newIncident = result.rows[0];

			res.status(201).json(newIncident);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal server error' });
		}
	};

// A POST endpoint that searches for incidents based on country name.
export const searchIncidents =
	(db: Pool) => async (req: Request, res: Response) => {
		try {
			let { country } = req.body;

			// Check if country parameter is provided
			if (!country) {
				return res
					.status(400)
					.json({ error: 'Country parameter is required' });
			}

			// Construct SQL query
			const query = `
            SELECT *
            FROM incidents
            WHERE LOWER(country) = LOWER($1);
        `;

			// Define values to be passed as parameters to the SQL query
			const values = [country];

			// Retrieve incidents from the database
			const result = await db.query(query, values);
			const incidents = result.rows;

			// Check if no incidents were found
			if (!incidents || incidents.length === 0) {
				return res.status(404).json({ error: 'No incidents found' });
			}

			res.status(200).json(incidents);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal server error' });
		}
	};

// A GET endpoint that lists all the incidents.
// The endpoint should have the capability of filtering the data by city, temperature range and humidity range.
export const listIncidents =
	(db: Pool) => async (req: Request, res: Response) => {
		try {
			let { city, temp_min, temp_max, humidity } = req.query;
			if (!city) {
			}
			// Convert to numeric type
			let tem_min: number | undefined = temp_min
				? parseInt(temp_min as string)
				: undefined;
			let tem_max: number | undefined = temp_max
				? parseInt(temp_max as string)
				: undefined;
			let humid: number | undefined = humidity
				? parseInt(humidity as string)
				: undefined;

			// Construct base SQL query
			let query = `
            SELECT
                jsonb_build_object(
                    'main', jsonb_build_object(
                        'temp', (weather_report->'main'->>'temp')::numeric,
                        'humidity', (weather_report->'main'->>'humidity')::numeric
                    ),
                    'name', (weather_report->>'name')
                ) AS weather_info
            FROM incidents
        `;

			let whereClauses: string[] = [];

			// Append WHERE clauses based on provided filters
			if (city) {
				whereClauses.push(
					`(weather_report->>'name') ILIKE '%${city}%'`,
				);
			}

			if (tem_min && tem_max) {
				whereClauses.push(
					`(weather_report->'main'->>'temp')::numeric >= ${tem_min} AND (weather_report->'main'->>'temp')::numeric <= ${tem_max}`,
				);
			}

			if (humid) {
				whereClauses.push(
					`(weather_report->'main'->>'humidity')::numeric = ${humid}`,
				);
			}

			// Add WHERE clause to the query if there are any filters
			if (whereClauses.length > 1) {
				query += ` WHERE ${whereClauses.join(' AND ')}`;
			} else if (whereClauses.length === 1) {
				query += ` WHERE ${whereClauses[0]}`;
			}

			const { rows } = await db.query(query);

			if (!rows || rows.length === 0) {
				return res.status(404).json({ error: 'No incidents found' });
			}

			// Send the response with the fetched data
			res.json(rows);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	};
