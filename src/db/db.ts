import { Pool } from 'pg';
require('dotenv').config();

let pool: Pool | null = null;
if (!pool) {
	pool = new Pool({
		connectionString: process.env.DATABASE_CONNECTION,
	});
}
export default pool;
