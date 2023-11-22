import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";

interface TableProps {
  tableHead: string[];
  tableBody: string[][];
  className?: string;
  month?: string;
  deleteButton?: boolean;
  editButton?: boolean;
  checkbox?: boolean;
  onChange?: (selectedValue: string) => void;
}

const ViewTable: React.FC<TableProps> = ({
  tableHead,
  tableBody,
  deleteButton,
  editButton,
  checkbox,
  className,
  month,
}) => {
  const [status, setStatus] = useState<string>("absent");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter students based on the search query
  const filteredStudents: string[][] = tableBody.filter((student) => {
    const studentName = student[0].toLowerCase();
    const query = searchQuery.toLowerCase();
    return studentName.includes(query);
  });

  //download sheet
  const handleDownload = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([tableHead, ...tableBody]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, `${month}`);

    // Save the workbook as an Excel file
    XLSX.writeFile(workbook, `${className}.xlsx`);

    // Show a success message
    toast.success("Downloaded Successfully");
  };

  return (
    <div className="flex flex-col">
      <Toaster />
      <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row items-center sm:justify-between">
          <div className="relative max-w-xs sm:mb-0">
            <label htmlFor="hs-table-search" className="sr-only">
              Search
            </label>
            <input
              type="text"
              name="hs-table-search"
              id="hs-table-search"
              className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
              placeholder="Type Here to Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="h-3.5 w-3.5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3 h-20">
            <div>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleDownload}
              >
                Download this sheet
              </button>
            </div>
          </div>
        </div>
        <div className="inline-block align-middle overflow-y-auto h-[80vh]">
          <div className="overflow-x-auto border rounded-lg w-96 md:w-[40vw] xl:w-[40vw] lg:w-[40vw]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 ">
                <tr className="bg-[#041d55]">
                  {tableHead.map((item, index) => {
                    return (
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-white uppercase "
                        key={index}
                      >
                        {item}
                      </th>
                    );
                  })}
                  {checkbox ? (
                    <td className="py-3 px-4">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="text-blue-600 h-5 w-5 border-gray-200 rounded focus:ring-blue-500"
                          checked={status === "present"}
                          onChange={() => {
                            if (status === "absent") {
                              setStatus("present");
                            } else {
                              setStatus("absent");
                            }
                          }}
                        />
                        <label htmlFor="checkbox" className="sr-only">
                          Checkbox
                        </label>
                      </div>
                    </td>
                  ) : null}
                  {editButton ? (
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
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
                {filteredStudents.map((student: string[], index: number) => {
                  return (
                    <tr
                      className={`text-gray-800 bg-[#e2f6fe] hover:bg-[#004678] hover:text-white`}
                      key={index}
                    >
                      {student.map((element: string, index: number) => (
                        <td
                          key={index}
                          className="px-6 py-4 text-sm font-medium whitespace-nowrap"
                        >
                          {element}
                        </td>
                      ))}
                      {checkbox ? (
                        <td className="py-3 px-4">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              className="text-blue-600 h-5 w-5 border-gray-200 rounded focus:ring-blue-500"
                              checked={status === "present"}
                              onChange={() => {
                                if (status === "absent") {
                                  setStatus("present");
                                } else {
                                  setStatus("absent");
                                }
                              }}
                            />
                            <label htmlFor="checkbox" className="sr-only">
                              Checkbox
                            </label>
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

export default ViewTable;
