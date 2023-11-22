import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  sendOtp,
  teacherLogin,
  verifyOtpAndUpdatePassword,
} from "../api/Login";
import "./componentsStyle.css";

const TeacherLogform = () => {
  const [instructorId, setInstructorId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userNotFoundMsg, setUserNotFoundMsg] = useState<string>("");
  const [isForget, setIsForget] = useState<boolean>(false);
  const [isOtpSend, setIsOtpSend] = useState<boolean>(false);
  const [otp, setOtp] = useState<number>();
  const [newPassword, setNewPassword] = useState<string>("");
  const enrollment: string = "NA";
  const [loader, setLoader] = useState<boolean>(false);

  const loginUser = async (instructor_id: string, pass: string) => {
    try {
      if (instructorId && password) {
        setLoader(true);
        const response = await teacherLogin(instructor_id, pass);
        const { token, employeeDetails } = response.data;
        if (token) {
          localStorage.setItem("token", JSON.stringify(token));
          localStorage.setItem("user", JSON.stringify(employeeDetails));
          toast.success("Login Successfull");
          setTimeout(() => {
            window.location.href = "/AdminPortal";
          }, 500);
          console.log(response);
        }
      } else {
        if (!instructorId) toast.error("Please Enter Employee ID");
        else toast.error("Please Enter Password");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const err = error as {
          response?: {
            data: {
              message: string;
            };
            status?: number;
            message: string;
          };
        };
        if (
          err.response &&
          err.response.status &&
          err.response.status >= 400 &&
          err.response.status <= 500
        ) {
          console.log(err.response?.data?.message);
          setUserNotFoundMsg(err.response?.data?.message);
          toast.error(err.response?.data?.message);
          setLoader(false);
        } else {
          console.log(err);
          console.log(err);
        }
      }
    }
  };

  const updatePassword = async (enroll: string, instructor_id: string) => {
    try {
      if (instructor_id) {
        setLoader(true);
        setUserNotFoundMsg("");
        const response = await sendOtp(enroll, instructor_id);
        console.log(response.data);
        if (response.data.success) {
          setIsOtpSend(true);
          setLoader(false);
        }
        toast.success(response.data.message);
      } else {
        toast.error("Please Enter Employee ID");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const err = error as {
          response?: {
            data: {
              message: string;
            };
            status?: number;
            message: string;
          };
        };
        if (
          err.response &&
          err.response.status &&
          err.response.status >= 400 &&
          err.response.status <= 500
        ) {
          setLoader(false);
          console.log(err.response?.data?.message);
          toast.error(err.response?.data?.message);
          setUserNotFoundMsg(err.response?.data?.message);
        } else {
          console.log(err);
          console.log(err);
        }
      }
    }
  };

  const verifyOtp = async () => {
    try {
      if (otp && newPassword) {
        setLoader(true);
        const response = await verifyOtpAndUpdatePassword(
          enrollment,
          newPassword,
          instructorId,
          otp
        );
        console.log(response.data);
        if (response.data.success) {
          toast.success(response.data.message);
          setLoader(false);
          setIsForget(false);
        }
      } else {
        if (!newPassword) {
          toast.error("Please Enter New Password");
        } else {
          toast.error("Please Enter OTP");
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const err = error as {
          response?: {
            data: {
              message: string;
            };
            status?: number;
            message: string;
          };
        };
        if (
          err.response &&
          err.response.status &&
          err.response.status >= 400 &&
          err.response.status <= 500
        ) {
          setLoader(false);
          console.log(err.response?.data?.message);
          toast.error(err.response?.data?.message);
          setUserNotFoundMsg(err.response?.data?.message);
        } else {
          console.log(err);
          console.log(err);
        }
      }
    }
  };

  return (
    <>
      <Toaster />
      {loader ? (
        <div className="flex justify-center items-center h-[150px]">
          <div className="loader">
            <div className="dot-spinner">
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
            </div>
          </div>
        </div>
      ) : isForget ? (
        <div className="m-10 mt-7">
          <div>
            <div className="mb-4">
              <input
                type="text"
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 my-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your Employee ID"
                required
              />
              {userNotFoundMsg ? (
                <p className="text-red-500 text-xs italic">
                  {userNotFoundMsg} Try Again...
                </p>
              ) : (
                ""
              )}
            </div>
            {isOtpSend ? (
              <>
                <div className="mb-4">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter New Password"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(parseInt(e.target.value))}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your OTP"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      verifyOtp();
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Update Password
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    updatePassword(enrollment, instructorId);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Send Otp
                </button>
                <button
                  onClick={() => {
                    setIsForget(false);
                    setUserNotFoundMsg("");
                    setPassword("");
                  }}
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                  LogIn Instead?
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="m-10 mt-7">
          <div>
            <div className="mb-4">
              <input
                type="text"
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your Employee ID"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Password"
                required
              />
              {userNotFoundMsg ? (
                <p className="text-red-500 text-xs italic">
                  {userNotFoundMsg} Try Again...
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  loginUser(instructorId, password);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setIsForget(true);
                  setInstructorId("");
                  setUserNotFoundMsg("");
                }}
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherLogform;
