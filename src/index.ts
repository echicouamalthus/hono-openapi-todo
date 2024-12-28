
import { serve } from "@hono/node-server";

import app from "./app";

const port = 9999;

console.log(`Server is running on port http://localhost:${port}/api`);

serve({
  fetch: app.fetch,
  port,
});
