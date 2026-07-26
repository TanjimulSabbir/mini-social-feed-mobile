import { z } from "zod";
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormDataType = z.infer<typeof loginSchema>;

export function validate({ email, password }: LoginFormDataType) {
  const result = loginSchema.safeParse({ email: email.trim(), password });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      email: fieldErrors.email?.[0] || "",
      password: fieldErrors.password?.[0] || "",
    };
  }

  return true;
}
