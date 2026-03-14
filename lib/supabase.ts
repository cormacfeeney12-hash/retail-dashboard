import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nrbzluyzjtjnxzrveadq.supabase.co";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yYnpsdXl6anRqbnh6cnZlYWRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzMTQ0MywiZXhwIjoyMDg4OTA3NDQzfQ.6SmWS7AT-2YMYPhhZPkUB8Na_mbNw82qEWeN1VWc0yU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
