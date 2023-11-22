import React from "react";
import Sidepanel from "../../components/Sidepanel";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./MainPages/Dashboard";
import DownloadAttendance from "./AttendancePages/DownloadAttendance";
import TakeAttendance from "./AttendancePages/TakeAttendance";
import Profilecard from "../../components/Profilecard";
import Navbar from "../../components/Navbar";
import UpdateAttendance from "./AttendancePages/UpdateAttendance";
import { Toaster } from "react-hot-toast";

const AdminPortal: React.FC = () => {
  const data = JSON.parse(localStorage.getItem("user") || "");
  console.log("data", data);
  return (
    <>
      <Toaster />
      <div className="h-screen">
        <div className="sticky lg:static">
          <Navbar />
        </div>
        <div className="md:flex lg:flex h-max">
          <div className="absolute z-10 lg:static w-fit h-screen">
            <Sidepanel />
          </div>
          <div className="w-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/DownloadAttendance"
                element={<DownloadAttendance />}
              />
              <Route path="/TakeAttendance" element={<TakeAttendance />} />
              <Route path="/UpdateAttendance" element={<UpdateAttendance />} />
              <Route path="/UpdateTeacher" element={<Dashboard />} />
              <Route path="/UpdateStudent" element={<Dashboard />} />
              <Route
                path="/Profile"
                element={
                  <Profilecard
                    name={data.name}
                    email={data.email}
                    id={data.instructor_id}
                    phoneNumber={data.phone}
                    designation={data.designation}
                    school={data.school}
                    subjects={data.subjects}
                  />
                }
              />
            </Routes>
          </div>
          <div
            className={`${
              window.innerWidth < 400
                ? "visibility: hidden"
                : "visibility: visible "
            } w-fit`}
          >
            <Profilecard
              name={data.name}
              email={data.email}
              id={data.instructor_id}
              phoneNumber={data.phone}
              designation={data.designation}
              school={data.school}
              subjects={data.subjects}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPortal;
