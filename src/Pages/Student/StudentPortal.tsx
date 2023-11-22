import React,{useEffect, useState} from "react";
import Profilecard from "../../components/Profilecard";
import Navbar from "../../components/Navbar";
import { Chart } from "react-google-charts";
import { BiEdit, BiLogOut, BiReset } from "react-icons/bi";
import Dropdown from "../../components/Dropdown";

export const data1 = [
  ["Subject", "attendance"],
  ["Software Eng", 25],
  ["OOps", 100],
  ["DSA", 75],
  ["CN", 50],
];

export const options1 = {
  chart: {
    title: "Attendance Performance",
    subtitle: "Dekhooooooooo",
  },
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const StudentPortal: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("january");
  useEffect(()=>{
    console.log(selectedMonth);
  },[selectedMonth]);

  const data = JSON.parse(localStorage.getItem("user") || "");
  console.log(data);
  return (
    <>
      <div className="w-screen h-screen">
        <div className="">
          <Navbar />
        </div>
        <div className="md:flex lg:flex h-max">
          <div className="flex flex-col justify-center items-center w-full p-3">
            
          <Dropdown
              name="Select Month"
              listItems={months}
              onChange={(selectedValue) => setSelectedMonth(selectedValue)}
              //value={selectedMonth}
            />

            <div>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={data1}
                options={options1}
              />
            </div>
          </div>
          <div>
            <Profilecard
              name={data.name}
              email={data.email}
              phoneNumber={data.phone}
              id={data.enrollment_no}
              course={data.course_id}
              subjects={data.subjects}
              batch={data.phone}
              student={true}
            />
            <div className="flex">
            <button
                onClick={() => {
                  window.location.href = "/";
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  localStorage.removeItem("selectedSection");
                }}
                className="font-bold text-lg -ml-2  flex mb-4 p-1 hover:bg-red-500 hover:rounded-md"
              >
                <BiLogOut size={26}  />
                <div className="font-bold text-lg ml-2">Log Out</div>
              </button>
              <button
                onClick={() => {
                  //initiatePasswordReset();
                  window.location.href='/'
                }}
                className="font-bold text-lg ml-4 flex mb-4 p-1 hover:bg-[#63e649] hover:rounded-md"
              >
                <BiReset  size={26}  />
                <div className="font-bold text-lg ml-2">Reset-Password</div>
              </button>
              
              <button
                onClick={() => {
                  // editEmail();
                  // editPhoneNumber();
                  window.location.href = '/StudentPortal';
                }}
                className="font-bold text-lg ml-1  flex mb-4 p-1 hover:bg-[#3366CC] hover:rounded-md"
              > 
                <BiEdit size={26}  />
                <div className="font-bold md:text-lg ml-2 ">Edit Profile</div>
              </button>
            </div>
            

          </div>
        </div>
      </div>
    </>
  );
};

export default StudentPortal;
