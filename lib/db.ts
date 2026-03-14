import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:DromoreWestFeeney2003@store-margin-tool.cncmsw0k8ivw.eu-north-1.rds.amazonaws.com:5432/postgres",
  ssl: { rejectUnauthorized: false },
  max: 10,
});

export default pool;
