import { serve } from "@hono/node-server";

import app from "./app";
import env from "./env";

const port = env.PORT;

if (env.NODE_ENV === "developpment") {
  console.log(`Server is running on port http://localhost:${port}/api`);
} else {
  console.log(`Server is running on port ${env.BASE_URL_API}`);
}

serve({
  fetch: app.fetch,
  port,
});
