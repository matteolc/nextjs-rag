import { z } from "zod";

const requiredInProduction: z.RefinementEffect<
  string | undefined
>["refinement"] = (value, ctx) => {
  if (process.env.NODE_ENV === "production" && !value) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Missing required environment variable ${ctx.path.join(".")}`,
    });
  }
};

const requiredInDevelopment: z.RefinementEffect<
  string | undefined
>["refinement"] = (value, ctx) => {
  if (process.env.NODE_ENV === "development" && !value) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Missing required environment variable ${ctx.path.join(".")}`,
    });
  }
};

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  BLOB_READ_WRITE_TOKEN: z.string(),
  OPENAI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
