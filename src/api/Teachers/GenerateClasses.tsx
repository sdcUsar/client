import axios from "axios";

const BASE_URL = "https://ams-x5ws.onrender.com";

export const generateClasses = async () => {
  const tokenWithQuotes: string = localStorage.getItem("token") || "";
  const token = tokenWithQuotes.replace(/"/g, "");
  const response = await axios.get(`${BASE_URL}/generateClasses`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
