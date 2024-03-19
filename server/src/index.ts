import express from "express";
import cors from "cors";
import submissionRouter from "./routes/submission.router";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/v1/api/submissions", submissionRouter);

app.get("/v1/api/test", (req: express.Request, res: express.Response) => {
  res.status(200).send({ message: "Hello World!" });
});

app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
