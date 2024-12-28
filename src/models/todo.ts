import { z } from "@hono/zod-openapi";

export const TodoSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    content: z.string().openapi({ example: "Buy milk" }),
    completed: z.boolean().openapi({ example: false }),
  })
  .openapi("TodoSchema");

export const TodoListSchema = z.array(TodoSchema).openapi("TodoListSchema");

export const TodoParamSchema = z.object({
  id: z.string().openapi({ example: "1" }),
});

export const CreateTodoSchema = TodoSchema.omit({
  id: true,
  completed: true,
});

export const UpdateTodoSchema = TodoSchema.omit({ id: true })
  .partial()
  .openapi("UpdateTodoSchema");
