import { Pool, types } from "pg";

// pg returns numeric/bigint columns as strings by default — parse them as JS numbers
types.setTypeParser(20, (val) => parseInt(val, 10));   // int8 (bigint)
types.setTypeParser(1700, (val) => parseFloat(val));   // numeric / decimal

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:DromoreWestFeeney2003@store-margin-tool.cncmsw0k8ivw.eu-north-1.rds.amazonaws.com:5432/postgres",
  ssl: { rejectUnauthorized: false },
  max: 10,
});

export default pool;
