import axios from "axios";

const BASE_URL = "https://ams-x5ws.onrender.com";

export const getAttendenceMonthly = async (batchId: number, month: number) => {
  const tokenWithQuotes: string = localStorage.getItem("token") || "";
  const token = tokenWithQuotes.replace(/"/g, "");
  const response = await axios.post(
    `${BASE_URL}/getonemonthattendance`,
    {
      period_id: batchId,
      month: month,
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

export const getTimeStamps = async (batchId: number) => {
  const id = batchId;
  console.log("id", id);
  return 0;
};
