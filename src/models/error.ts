import { z } from "@hono/zod-openapi";

export const MessageSchema = z
  .object({
    message: z.string().openapi({ example: "Not found" }),
    code: z.number().openapi({ example: 404 }),
  })
  .openapi("ErrorResponseSchema");
