import React from "react";
// import Table from "../../../components/Take.attendance.table";
import { Chart } from "react-google-charts";
import { EmployeeDetails } from "../AttendancePages/interfaces.attendance";

// export const data =

const options = {
  title: "Attendance (Present Vs Absent)",
  legend: "none",
  hAxis: {
    title: "Attendance",
  },
  vAxis: {
    minValue: 0,
    maxValue: 100,
  },
  bar: {
    groupWidth: "10%"
  }
};

const Dashboard: React.FC = () => {
  console.log("Dashboard component rendered");
  const teacher: EmployeeDetails = JSON.parse(
    localStorage.getItem("user") || ""
  ) || {
    instructor_id: "",
    dateCreated: 0,
    name: "",
    school: "",
    designation: "",
    email: "",
    phone: "",
    subjects: [
      {
        Subject_id: 0,
        subject_code: "",
        subject_name: "",
        subject_type: "",
      },
    ],
  };
  console.log(teacher);

  const data = [
    ["Attendance", "Strength", { role: "style" }],
    ["Present", 75, ""],
    ["Absent", 45, ""],
  ];
  return (
    <div className="flex flex-col justify-center items-center p-3">
      <Chart
        chartType="ColumnChart"
        data={data}
        options={options}
        width="100%"
        height="600px"
      />
    </div>
  );
};

export default Dashboard;
