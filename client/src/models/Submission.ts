import { z } from "zod";

export const SubmissionFormSchema = z.object({
  username: z.string().trim().min(2).max(30),
  language_id: z.string(),
  source_code: z.string().min(1),
  stdin: z.string().min(1),
});

export type SubmissionFormType = z.infer<typeof SubmissionFormSchema>;
