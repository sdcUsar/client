import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { Student } from "../Pages/TeacherAdmin/AttendancePages/interfaces.attendance";

interface TableProps {
  tableHead: string[];
  tableBody: Student[];
  deleteButton?: boolean;
  editButton?: boolean;
  checkbox?: boolean;
  onSubmit: (val: Student[]) => unknown;
  downloadButton?: boolean;
}

const Table: React.FC<TableProps> = ({
  tableHead,
  tableBody,
  deleteButton,
  editButton,
  checkbox,
  onSubmit,
  downloadButton,
}) => {
  const [students, setStudents] = useState(() => {
    tableBody.map((x) => {
      x.status = "absent";
    });
    return tableBody;
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const updateAttendance = (enrollmentNo: string, status: string) => {
    setStudents((s) => {
      return s.map((x) => {
        if (x.enrollmentNo === enrollmentNo) {
          return { ...x, status };
        }
        return x;
      });
    });
  };

  // Filter students based on the search query
  const filteredStudents: Student[] = students.filter((student) => {
    const studentName = student.name.toLowerCase();
    const enrollmentNo = student.enrollmentNo.toLowerCase();
    const email = student.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      studentName.includes(query) ||
      enrollmentNo.includes(query) ||
      email.includes(query)
    );
  });

  // Function to handle the "Submit" button click
  const handleSubmission = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to submit the attendance.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (!result.isConfirmed) {
      return;
    }
    return onSubmit(students);
  };

  return (
    <div className="flex flex-col">
      <Toaster />
      <div className="overflow-x-auto">
        <div className="p-4 flex flex-col items-center sm:flex-row sm:justify-between">
          <div className="relative max-w-xs  mb-4 sm:mb-0">
            <label htmlFor="hs-table-search" className="sr-only">
              Search
            </label>
            <input
              type="text"
              name="hs-table-search"
              id="hs-table-search"
              className="block w-full p-3 pl-10 text-sm border-black rounded-md focus:border-blue-500 focus:ring-blue-500 bg-[#e2f6fe] text-black placeholder-black"
              placeholder="Type Here to Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="h-3.5 w-3.5 black"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="black"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-row sm:justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmission}
            >
              Submit
            </button>
            {downloadButton ? (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                onClick={() => {
                  // Handle the download functionality here
                  console.log("Download button clicked");
                }}
              >
                Download
              </button>
            ) : null}
          </div>
        </div>

        <div className="w-full inline-block align-middle overflow-y-auto h-[80vh] ">
          <div className="overflow-x-auto  border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="bg-[#041d55]">
                  {tableHead.map((item, index) => {
                    // Condition check karega and then email header ko render karega
                    if (index !== 2 || window.innerWidth > 600) {
                      // Check if it's not the email column or if the window width is greater than 600px
                      return (
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-white uppercase"
                          key={index}
                        >
                          {item}
                        </th>
                      );
                    } else {
                      return null; // Don't render the email header
                    }
                  })}
                  {checkbox ? (
                    <td className="py-3 px-4">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="text-blue-600 h-5 w-5 border-gray-200 rounded focus:ring-blue-500"
                          onChange={(e) => {
                            const status: string = e.target.checked
                              ? "present"
                              : "absent";
                            setStudents((x) => {
                              return x.map((e) => {
                                e.status = status;
                                return e;
                              });
                            });
                          }}
                        />
                        <label htmlFor="checkbox" className="sr-only">
                          Checkbox
                        </label>
                      </div>
                    </td>
                  ) : null}
                  {editButton ? (
                    <td className="px-6  py-4 text-sm font-medium text-right whitespace-nowrap">
                      Edit
                    </td>
                  ) : null}
                  {deleteButton ? (
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      Delete
                    </td>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student: Student, index: number) => {
                  return (
                    <tr
                      className={`text-gray-800 bg-[#e2f6fe] hover:bg-[#004678] hover:text-white`}
                      key={index}
                    >
                      <>
                        <td className="px-3 sm:px-6 py-4 text-sm font-medium whitespace-nowrap">
                          {student.enrollmentNo}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm font-medium whitespace-nowrap">
                          {student.name}
                        </td>
                        {window.innerWidth > 600 && (
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            {student.email}
                          </td>
                        )}
                      </>
                      {checkbox ? (
                        <td className="py-3 px-4">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              className="text-blue-600 h-5 w-5 border-gray-200 rounded focus:ring-blue-500"
                              checked={student.status === "present"}
                              onChange={() => {
                                if (student.status === "absent") {
                                  updateAttendance(
                                    student.enrollmentNo,
                                    "present"
                                  );
                                } else {
                                  updateAttendance(
                                    student.enrollmentNo,
                                    "absent"
                                  );
                                }
                              }}
                            />
                          </div>
                        </td>
                      ) : null}
                      {editButton ? (
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Edit
                          </a>
                        </td>
                      ) : null}
                      {deleteButton ? (
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <a
                            className="text-red-500 hover:text-red-700"
                            href="#"
                          >
                            Delete
                          </a>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
