import { z, ZodError } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default("developpment"),
  PORT: z.coerce.number().default(9999),
  BASE_URL_API: z.string().url(),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error("❌ invalid env:");
  console.log(error.flatten());
  process.exit(1);
}

export default env;
