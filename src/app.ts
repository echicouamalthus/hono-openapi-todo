import { cors } from "hono/cors";
import { defaultHook } from "stoker/openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import { apiReference } from "@scalar/hono-api-reference";
import packageJSON from "../package.json";
import { OpenAPIHono } from "@hono/zod-openapi";

import { app as todoRoute } from "./routes/todo";

const app = new OpenAPIHono({
  strict: false,
  defaultHook,
});

app.use(serveEmojiFavicon("🔥"));

app.use(
  "*",
  cors({
    origin: "http://localhost:9999/api", // Replace with your frontend's origin
    allowMethods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    allowHeaders: ["Content-Type", "Authorization", "Cookie"], // Allow specific headers
  })
);

app.notFound(notFound);
app.onError(onError);

// app.doc("/doc", {
//   openapi: "3.0.0",
//   info: {
//     title: "Todo API",
//     version: packageJSON.version,
//     description:
//       "This is the Todo API documentation. It provides endpoints to manage your todo items, including creating, updating, deleting, and retrieving todos. The API is designed to be simple and easy to use, with clear and concise endpoints. Authentication is required for most operations, and responses are provided in JSON format.",
//   },
// });

app.get("/", (c) => {
  return c.json({
    message: `Welcome to the Todo API! 🔥 You can find the API documentation at http://localhost:9999/api/reference`,
  });
});

app.route("/todo", todoRoute);

// app.get(
//   "/reference",
//   apiReference({
//     pageTitle: "Todo Api Reference",
//     theme: "saturn",
//     layout: "classic",
//     defaultHttpClient: {
//       targetkey: "javascript",
//       clientkey: "axios",
//     },
//     spec: {
//       url: "/api/doc",
//     },
//   })
// );

export default app;
