import { z } from "zod";

export const SignUpSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(2, "Name must be minimum 2 charaters long")
      .max(20, "Name cannot be longer than 20 characters"),
    password: z
      .string({
        required_error: "Role is required",
      })
      .min(8, "Password must be minimum 8 charaters long")
      .max(20, "Password cannot be longer than 20 characters"),
  }),
});

export const LogInSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    password: z
      .string({
        required_error: "Role is required",
      })
      .min(8, "Password must be minimum 8 charaters long")
      .max(20, "Password cannot be longer than 20 characters"),
  }),
});

export const UpdateUserRoleSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.enum(["USER", "ADMIN"]),
  }),
});
