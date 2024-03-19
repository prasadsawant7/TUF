import Express from "express";
import { PrismaClient } from "@prisma/client";
import useJudge0 from "./useJudge0";
import {
  redisClient,
  redisGet,
  redisSet,
  redisExpire,
  redisIncrement,
  redisDecrement,
} from "../utils/redisClient";

const { create, read } = useJudge0();

const submissionClient = new PrismaClient().submission;

const useSubmission = () => {
  const readAllSubmissions = async (res: Express.Response) => {
    // If any submission is in queue or processing try to get the latest status of submission and update it
    // before rendering the all submissions. This step is added because there are less workers in Judge0 who
    // creates the submission and the code doesn't wait so the status remains In Queue or Processing.
    // To get refreshed status of submissions this stemp is added.

    try {
      const pendingSubmissions = await submissionClient.findMany({
        where: {
          status: {
            in: ["In Queue", "Processing"],
          },
        },
        orderBy: {
          submitted_at: "asc",
        },
      });

      if (pendingSubmissions.length > 0) {
        await Promise.all(
          pendingSubmissions.map(async (submission) => {
            const id = submission.id;
            const token = submission.token;

            if (token) {
              const {
                stdout,
                time,
                memory,
                status: { description: status },
              } = await read(token);

              const submission = await submissionClient.update({
                where: {
                  id,
                },
                data: {
                  stdout,
                  time,
                  memory,
                  status,
                },
              });

              await redisSet(`submissions:${id}`, JSON.stringify(submission));
              await redisExpire(`submissions:${id}`, 300);

              return submission;
            }
          })
        );
      }

      const submissionsKeys = await redisClient.keys("submissions:*");
      const rows_count = await redisGet("rows_count");

      // The second condition is added because, assume a scenario where initially db is empty (submissionsKeys.length === rows_count)
      // 1. User submits a solution and the solution gets cached for 300 seconds (5 minutes)
      // 2. After 4 minutes passed lets assume user submits another submission,
      //    at this point 1st submission will be having only 1 minute to get expired.
      // 3. After 1 minute lets say user redirects to the 2nd page where we are rendering the submissions
      // 4. At this point the 1st solution is expired and the 2nd solution is in cache with remaining time of 4 minutes
      // 5. After mounting the 2nd page, useEffect will try to fetch data and controller will first check in cache
      // 6. Cache will have only 1 key-value pair and it will return that.
      // 7. User will only be able to see recent submission, to avoid this I have maintained a rows_count
      // 8. rows_count help to check whether cache is in sync with the db data or not.
      // 9. And also all key-value pairs will be expiring at the same time ensuring the sync in between key-value pairs.
      // 10. Only submissionsKeys.length > 0 or submissionsKeys won't cover these edge conditions.

      if (
        submissionsKeys.length > 0 &&
        submissionsKeys.length === parseInt(rows_count)
      ) {
        // The reason behind fetching values under group named as "submissions" using
        // redisClient.mget is because there is no function to fetch all string values
        // normally and even under any group.
        // redisClient.mget return array of strings and strings containing objects
        console.log("Data retrieved from Redis cache");
        const submissionsValues = await redisClient.mget(submissionsKeys);
        const cachedData = submissionsValues.map((str) => JSON.parse(str));
        return res.status(200).json({ data: cachedData });
      }

      const submissions = await submissionClient.findMany({
        orderBy: {
          submitted_at: "asc",
        },
      });

      await Promise.all(
        submissions.map(async (submission) => {
          await redisSet(
            `submissions:${submission.id}`,
            JSON.stringify(submission)
          );
          await redisExpire(`submissions:${submission.id}`, 300);
        })
      );

      res.status(200).send({ data: submissions });
    } catch (error) {
      console.log(error);
    }
  };

  const readSpecificSubmission = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    try {
      const submissionId = req.params.id;

      const cachedData = await redisGet(`submissions:${submissionId}`);
      if (cachedData) {
        console.log("Data retrieved from Redis cache");
        return res.status(200).json({ data: JSON.parse(cachedData) });
      }

      const submission = await submissionClient.findUnique({
        where: {
          id: submissionId,
        },
      });

      await redisSet(`submissions:${submissionId}`, JSON.stringify(submission));
      await redisExpire(`submissions:${submissionId}`, 300);

      res.status(200).send({ data: submission });
    } catch (error) {
      console.log(error);
    }
  };

  const insertSubmission = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    try {
      const { username, language_id, source_code, stdin } = req.body;

      const token = await create(language_id, source_code, stdin);

      if (token) {
        const {
          stdout,
          time,
          memory,
          status: { description: status },
          created_at: submitted_at,
        } = await read(token);

        const submission = await submissionClient.create({
          data: {
            username,
            language_id,
            source_code,
            stdin,
            stdout,
            time,
            memory,
            status,
            token,
            submitted_at,
          },
        });

        const updatedSubmission = {
          ...submission,
          submitted_at: submission.submitted_at.toISOString(),
        };

        await redisSet(
          `submissions:${submission.id}`,
          JSON.stringify(updatedSubmission)
        );
        await redisExpire(`submissions:${submission.id}`, 300);
        await redisIncrement("rows_count");

        res.status(200).send({ data: submission });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSpecificSubmission = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    try {
      const submissionId = req.params.id;
      await submissionClient.delete({
        where: {
          id: submissionId,
        },
      });

      await redisClient.del(`submissions:${submissionId}`);
      await redisDecrement("rows_count");

      res.status(200).send({ data: {} });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    readAllSubmissions,
    readSpecificSubmission,
    insertSubmission,
    deleteSpecificSubmission,
  };
};

export default useSubmission;
