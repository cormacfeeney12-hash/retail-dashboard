/**
 * Client-side RDS query helper.
 * Calls /api/db/query which runs SQL against AWS RDS.
 */

interface QueryResult<T> {
  data: T[] | null;
  error: { message: string; code?: string } | null;
}

async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  try {
    const res = await fetch("/api/db/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql, params }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { data: null, error: { message: json.error ?? "Query failed" } };
    }
    return { data: json.rows as T[], error: null };
  } catch (err) {
    return {
      data: null,
      error: { message: err instanceof Error ? err.message : "Network error" },
    };
  }
}

/** Insert a row and return it */
async function insert<T = Record<string, unknown>>(
  table: string,
  row: Record<string, unknown>,
): Promise<QueryResult<T>> {
  const keys = Object.keys(row);
  const vals = Object.values(row);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
  const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
  return query<T>(sql, vals);
}

export const rds = { query, insert };
