import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  CreateTodoSchema,
  TodoListSchema,
  TodoSchema,
  UpdateTodoSchema,
} from "../models/todo";
import * as HttpStatusCode from "stoker/http-status-codes";
import * as HttpPhraseCode from "stoker/http-status-phrases";
import { MessageSchema } from "../models/error";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

export const app = new OpenAPIHono();

const todoList = [
  { id: 1, content: "Learn TypeScript", completed: false },
  { id: 2, content: "Build a Todo API", completed: false },
  { id: 3, content: "Deploy to Vercel", completed: true },
];

//get all todos

const getAllTodoRoute = createRoute({
  method: "get",
  description:
    "This route retrieves the complete list of todos. It returns an array of objects representing each todo with their respective details. Use this route to obtain an overview of all todos registered in the system.",
  summary: "Get all todos",
  path: "/",
  tags: ["todo"],
  responses: {
    [HttpStatusCode.OK]: jsonContent(TodoListSchema, "Get all todos"),
  },
});

app.openapi(getAllTodoRoute, (c) => {
  return c.json(todoList, HttpStatusCode.OK);
});

//get todo by id

const getIdTodoRoute = createRoute({
  method: "get",
  description:
    "This route retrieves a specific todo using its unique identifier. It returns an object representing the todo with its respective details. Use this route to obtain information about a particular todo registered in the system.",
  summary: "Get a todo by id",
  path: "/{id}",
  tags: ["todo"],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCode.OK]: jsonContent(TodoSchema, "Get a todo by id"),
    [HttpStatusCode.NOT_FOUND]: jsonContent(MessageSchema, "Not found"),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "invalid id error"
    ),
  },
});

app.openapi(getIdTodoRoute, (c) => {
  const { id } = c.req.valid("param");
  const todo = todoList.find((todo) => todo.id === Number(id));

  if (!todo) {
    return c.json(
      { code: HttpStatusCode.NOT_FOUND, message: HttpPhraseCode.NOT_FOUND },
      HttpStatusCode.NOT_FOUND
    );
  }

  return c.json(todo, HttpStatusCode.OK);
});

//create a todo

const createTodoRoute = createRoute({
  method: "post",
  description:
    "This route is used to create a new todo. It accepts a JSON object containing the details of the todo to be created, such as the todo content. Once the todo has been created, it returns the object representing the newly created todo with its unique identifier and completion status. Use this route to add new todos to your list.",
  summary: "Create a todo",
  path: "/",
  tags: ["todo"],
  request: {
    body: jsonContentRequired(CreateTodoSchema, "Create a todo"),
  },
  responses: {
    [HttpStatusCode.CREATED]: jsonContent(TodoSchema, "Create a todo"),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(CreateTodoSchema),
      "validation error"
    ),
  },
});

app.openapi(createTodoRoute, async (c) => {
  const { content } = await c.req.valid("json");
  const id = todoList.length + 1;
  const todo = { id, content, completed: false };
  todoList.push(todo);

  return c.json(todo, HttpStatusCode.CREATED);
});

//patch a todo

const patchTodoRoute = createRoute({
  method: "patch",
  description:
    "This route updates an existing todo using its unique identifier. It accepts a JSON object containing the details of the todo to be updated, such as todo content and completion status. Once the todo has been updated, it returns the object representing the updated todo with its new details. Use this route to modify the information of a particular todo registered in the system.",
  summary: "Update a todo by id",
  path: "/{id}",
  tags: ["todo"],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(UpdateTodoSchema, "Update a todo"),
  },
  responses: {
    [HttpStatusCode.OK]: jsonContent(TodoSchema, "Update a todo"),
    [HttpStatusCode.NOT_FOUND]: jsonContent(MessageSchema, "todo not found"),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UpdateTodoSchema).or(createErrorSchema(IdParamsSchema)),
      "invalid id error"
    ),
  },
});

app.openapi(patchTodoRoute, async (c) => {
  const { id } = c.req.valid("param");
  const { content, completed } = await c.req.valid("json");
  const index = todoList.findIndex((todo) => todo.id === Number(id));

  if (index === -1) {
    return c.json(
      { code: HttpStatusCode.NOT_FOUND, message: HttpPhraseCode.NOT_FOUND },
      HttpStatusCode.NOT_FOUND
    );
  }

  todoList[index] = {
    id: Number(id),
    content: content !== undefined ? content : todoList[index].content,
    completed: completed !== undefined ? completed : todoList[index].completed,
  };

  return c.json(todoList[index], HttpStatusCode.OK);
});

//delete a todo

const deleteTodoRoute = createRoute({
  method: "delete",
  description:
    "This route deletes an existing todo using its unique identifier. Once the todo has been deleted, it returns an empty response with HTTP status code 204. Use this route to delete a particular todo registered in the system.",
  summary: "Delete a todo by id",
  path: "/{id}",
  tags: ["todo"],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCode.NO_CONTENT]: {
      description: "Delete a todo",
    },
    [HttpStatusCode.NOT_FOUND]: jsonContent(MessageSchema, "todo not found"),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "invalid id error"
    ),
  },
});

app.openapi(deleteTodoRoute, (c) => {
  const { id } = c.req.valid("param");
  const index = todoList.findIndex((todo) => todo.id === Number(id));

  if (index === -1) {
    return c.json(
      { code: HttpStatusCode.NOT_FOUND, message: HttpPhraseCode.NOT_FOUND },
      HttpStatusCode.NOT_FOUND
    );
  }

  todoList.splice(index, 1);

  return c.json(undefined, HttpStatusCode.NO_CONTENT);
});
