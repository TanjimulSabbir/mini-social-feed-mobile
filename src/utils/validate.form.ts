import { z } from "zod";

export function validateForm<TSchema extends z.ZodObject<any>>(
  schema: TSchema,
  data: unknown,
):
  | { valid: true; data: z.infer<TSchema> }
  | { valid: false; errors: Partial<Record<keyof z.infer<TSchema>, string>> } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errors: Partial<Record<keyof z.infer<TSchema>, string>> = {};

    for (const key in fieldErrors) {
      const messages = fieldErrors[key as keyof typeof fieldErrors];
      if (messages && messages.length > 0) {
        errors[key as keyof z.infer<TSchema>] = messages[0];
      }
    }

    return { valid: false, errors };
  }

  return { valid: true, data: result.data };
}
