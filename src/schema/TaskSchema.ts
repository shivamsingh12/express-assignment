import { z } from "zod";

export const CreateTaskSchema = z.object({
  body: z.object({
    assignedTo: z.string().email().optional(),
    description: z
      .string({ required_error: "description is required" })
      .min(8)
      .max(100),
    dueDate: z.string({ required_error: "date is required" }).date(),
    status: z.enum(["UNASSIGNED", "PENDING", "COMPLETED"]).optional(), // UNASSIGNED, PENDING, COMPLETED
    title: z.string({ required_error: "title is required" }).min(4).max(50),
  }),
});

export const UpdateTaskSchema = z.object({
  body: z.object({
    assignedTo: z.string().email().optional(), // adding this changed status to pending, removing this changes to unassigned
    description: z
      .string({ required_error: "description is required" })
      .min(8)
      .max(100)
      .optional(),
    status: z.enum(["UNASSIGNED", "PENDING", "COMPLETED"]).optional(), // UNASSIGNED, PENDING, COMPLETED
  }),
});

export const QueryTaskSchema = z.object({
  query: z.object({
    dueDateGT: z.string().date().optional(),
    dueDateLT: z.string().date().optional(),
    status: z.enum(["UNASSIGNED", "PENDING", "COMPLETED"]).optional(),
  }),
});
