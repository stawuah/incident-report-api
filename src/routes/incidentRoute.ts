import express from 'express';
import {
	createIncident,
	searchIncidents,
	listIncidents,
} from '../controller/incidentController';

const router = express.Router();

router.get('/fetch-incident-report', listIncidents);
router.post('/report-incident', createIncident);
router.post('/search', searchIncidents);
export default router;
