import Express from "express";
import useSubmission from "../hooks/useSubmission";

const {
  readAllSubmissions,
  readSpecificSubmission,
  insertSubmission,
  deleteSpecificSubmission,
} = useSubmission();

// Get All Submissions
export const getAllSubmissions = async (
  req: Express.Request,
  res: Express.Response
) => {
  readAllSubmissions(res);
};

// Get Submission by Id
export const getSubmissionById = async (
  req: Express.Request,
  res: Express.Response
) => {
  readSpecificSubmission(req, res);
};

// Create Submission
export const createSubmission = async (
  req: Express.Request,
  res: Express.Response
) => {
  insertSubmission(req, res);
};

// Delete Submission
export const deleteSubmission = async (
  req: Express.Request,
  res: Express.Response
) => {
  deleteSpecificSubmission(req, res);
};
