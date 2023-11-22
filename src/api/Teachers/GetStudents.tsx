import axios from "axios";

const BASE_URL = "https://ams-x5ws.onrender.com";

export const getStudents = async (batch_id: number) => {
  const tokenWithQuotes: string = localStorage.getItem("token") || "";
  const token = tokenWithQuotes.replace(/"/g, "");
  const response = await axios.post(
    `${BASE_URL}/getstudents`,
    {
      batchId: batch_id,
    },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
