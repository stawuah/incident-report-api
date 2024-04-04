import express from 'express';
import {
	createIncident,
	searchIncidents,
	listIncidents,
} from '../controller/incidentController';
import { Pool } from 'pg';

const router = express.Router();

export default (db: Pool) => {
	router.get('/fetch-incident-report', listIncidents(db));
	router.post('/report-incident', createIncident(db));
	router.post('/search', searchIncidents(db));
	return router;
};
