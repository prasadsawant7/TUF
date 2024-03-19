import { Router } from "express";
import {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  deleteSubmission,
} from "../controllers/submission.controller";

const submissionRouter = Router();

submissionRouter.get("/", getAllSubmissions);
submissionRouter.get("/:id", getSubmissionById);
submissionRouter.post("/", createSubmission);
submissionRouter.delete("/:id", deleteSubmission);

export default submissionRouter;
