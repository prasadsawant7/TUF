export type Submission = {
  id: string;
  username: string;
  language_id: string;
  source_code: string;
  stdin: string;
  stdout: string | null;
  time: string | null;
  memory: number | null;
  status: string;
  token: string;
  submitted_at: string;
};
