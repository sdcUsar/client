import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineUser } from "react-icons/hi";
import { GiTeacher } from "react-icons/gi";
// import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";

const Sidepanel: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(() => {
    return localStorage.getItem("selectedSection") || null;
  });
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
    setOpen(!open);
  };
  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
  };

  useEffect(() => {
    if (selectedSection) {
      localStorage.setItem("selectedSection", selectedSection);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (window.innerWidth < 400) {
      setOpen(false);
    }
  }, []);

  const sideRef = useRef<HTMLDivElement | null>(null);
  const handleOutsideClick = (e: MouseEvent) => {
    if (sideRef.current && !sideRef.current.contains(e.target as Node)) {
      setOpen(!open);
    }
  };
  useEffect(() => {
    if (window.innerWidth < 400) {
      document.addEventListener("click", handleOutsideClick, true);
    } else {
      document.removeEventListener("click", handleOutsideClick, true);
    }
  }, []);

  return (
    <>
      <div className="h-full">
        <button
          className={`p-1 m-5 ${
            open ? "visibility: hidden" : "visibility: visible"
          } bg-white `}
          onClick={() => handleClick()}
        >
          {open ? null : <GiHamburgerMenu size={27} />}
        </button>
        <div
          className={`flex gap-4 ${
            open ? "visibility: visible" : "visibility: hidden"
          } ${isClicked ? "animate-slideIn" : ""} w-72 h-full`}
          ref={sideRef}
        >
          <div
            className={`bg-[#041d55] text-white px-4 ${
              open ? "overflow-hidden" : "overflow-auto"
            } duration-300`}
          >
            <div className="flex justify-start items-center gap-2 overflow-auto duration-300">
              <button
                className="flex lg:hidden md:hidden xl:hidden mt-2 pt-3`"
                onClick={() => handleClick()}
              >
                {open ? <AiOutlineCloseCircle size={27} /> : null}
              </button>
            </div>
            <div
              className={`${
                open ? "visibility: visible" : "visibility: hidden"
              } overflow-auto duration-300`}
            >
              <div className="font-bold text-lg p-2 mt-1">Main</div>
              <div className="font-bold text-lg ml-7">
                <a href="/AdminPortal">
                  <div
                    className={`flex mb-4 p-1 hover:bg-blue-400 hover:rounded-md ${
                      selectedSection === "Dashboard"
                        ? "bg-blue-400 rounded-md"
                        : ""
                    }`}
                    onClick={() => handleSectionClick("Dashboard")}
                  >
                    <LuLayoutDashboard size={27} />
                    <div className="font-bold text-lg ml-4">Dashboard</div>
                  </div>
                </a>
                <a
                  href="/AdminPortal/Profile"
                  className={`flex lg:hidden md:hidden xl:hidden hover:bg-blue-400 hover:rounded-md ${
                    selectedSection === "My Profile"
                      ? "bg-blue-400 rounded-md"
                      : ""
                  }`}
                >
                  <div
                    className={`flex p-1 `}
                    onClick={() => handleSectionClick("My Profile")}
                  >
                    <HiOutlineUser size={27} />
                    <div className="font-bold text-lg ml-4">My Profile</div>
                  </div>
                </a>
              </div>
              <div className="font-bold text-lg p-2 mt-1">Attendance</div>
              <div className="font-bold text-lg ml-7">
                <a href="/AdminPortal/TakeAttendance">
                  <div
                    className={`flex justify-start items-center mb-4 p-1 hover:bg-blue-400 hover:rounded-md ${
                      selectedSection === "Take Attendance"
                        ? "bg-blue-400 rounded-md"
                        : ""
                    }`}
                    onClick={() => handleSectionClick("Take Attendance")}
                  >
                    <GiTeacher size={27} />
                    <div className="font-bold text-lg ml-4">
                      Take Attendance
                    </div>
                  </div>
                </a>
                {/* <a href="/AdminPortal/UpdateAttendance">
                  <div
                    className={`flex justify-start items-center mb-4 p-1 hover:bg-blue-400 hover:rounded-md ${
                      selectedSection === "Update Attendance"
                        ? "bg-blue-400 rounded-md"
                        : ""
                    }`}
                    onClick={() => handleSectionClick("Update Attendance")}
                  >
                    <GiTeacher size={27} />
                    <div className="font-bold text-lg ml-4">
                      Update Attendance
                    </div>
                  </div>
                </a> */}
                <a href="/AdminPortal/DownloadAttendance">
                  <div
                    className={`flex justify-start items-center mb-4 p-1 hover:bg-blue-400 hover:rounded-md ${
                      selectedSection === "Download Attendance"
                        ? "bg-blue-400 rounded-md"
                        : ""
                    }`}
                    onClick={() => handleSectionClick("Download Attendance")}
                  >
                    <GiTeacher size={27} />
                    <div className="font-bold text-lg ml-4">
                      View & Download Attendance
                    </div>
                  </div>
                </a>
              </div>
              {/* <div className="font-bold text-lg p-2 mt-1">Update</div> */}
              {/* <div className="font-bold text-lg ml-7">
              <a href="/AdminPortal/UpdateTeacher">
                <div
                  className={`flex mb-4 p-1 hover:bg-blue-400 hover:rounded-md ${
                    selectedSection === "Teacher"
                      ? "bg-blue-400 rounded-md"
                      : ""
                  }`}
                  onClick={() => handleSectionClick("Teacher")}
                >
                  <FaChalkboardTeacher size={27} />
                  <div className="font-bold text-lg ml-4">Teacher</div>
                </div>
              </a>
              <a href="/AdminPortal/UpdateStudent">
                <div
                  className={`flex mb-4 p-1 hover:bg-blue-400 hover:rounded-md ${
                    selectedSection === "Student"
                      ? "bg-blue-400 rounded-md"
                      : ""
                  }`}
                  onClick={() => handleSectionClick("Student")}
                >
                  <FaUserGraduate size={27} />
                  <div className="font-bold text-lg ml-4">Student</div>
                </div>
              </a>
            </div> */}
              <button
                onClick={() => {
                  window.location.href = "/teacherlogin";
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  localStorage.removeItem("selectedSection");
                }}
                className="font-bold text-lg ml-1 flex mb-4 p-1 hover:bg-red-600 hover:rounded-md"
              >
                <BiLogIn size={27} />
                <div className="font-bold w-24 text-lg ml-4">Log Out</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidepanel;
