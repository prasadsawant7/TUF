import axios from "axios";

const useJudge0 = () => {
  const create = async (
    language_id: number,
    source_code: string,
    stdin: string
  ) => {
    const options = {
      method: "POST",
      url: `${process.env.JUDGE0_API_URL}/submissions`,
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
      data: {
        language_id,
        source_code,
        stdin,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 201) {
        return response.data.token;
      } else {
        throw new Error("Error creating the submission - from Judge0");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const read = async (token: string) => {
    const options = {
      method: "GET",
      url: `${process.env.JUDGE0_GET_SUBMISSION_API_URL}/submissions/${token}?base64_encoded=true`,
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Error fetching the submission - from Judge0");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { create, read };
};

export default useJudge0;
