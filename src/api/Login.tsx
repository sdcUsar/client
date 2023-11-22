import axios, { AxiosResponse } from "axios";
import {
  EmployeeDetailsResponse,
  OtpResponse,
  StudentDetailsResponse,
} from "./Interfaces.api";

const BASE_URL = "https://ams-x5ws.onrender.com";

export const studentLogin = async (
  enrollment: string,
  password: string
): Promise<AxiosResponse<StudentDetailsResponse>> => {
  const response = await axios.post<StudentDetailsResponse>(
    `${BASE_URL}/loginWeb`,
    {
      enrollnment_no: enrollment,
      password: password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const teacherLogin = async (
  instructorId: string,
  password: string
): Promise<AxiosResponse<EmployeeDetailsResponse>> => {
  const response = await axios.post<EmployeeDetailsResponse>(
    `${BASE_URL}/loginApp`,
    {
      instructor_id: instructorId,
      password: password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const sendOtp = async (enrollment: string, instructorId: string) => {
  const response = await axios.post<OtpResponse>(
    `${BASE_URL}/updatePassword`,
    { enrollment_no: enrollment, instructor_id: instructorId },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const verifyOtpAndUpdatePassword = async (
  enrollment: string,
  newPassword: string,
  instructorId: string,
  otp: number
) => {
  const response = await axios.post(
    `${BASE_URL}/verifyOtp`,
    {
      enrollment_no: enrollment,
      instructor_id: instructorId,
      new_password: newPassword,
      otp: otp,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
