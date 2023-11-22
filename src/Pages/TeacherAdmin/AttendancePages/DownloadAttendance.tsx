import { useState, useEffect } from "react";
import Dropdown from "../../../components/Dropdown";
import "../../../components/componentsStyle.css";
import { generateClasses } from "../../../api/Teachers/GenerateClasses";
import toast, { Toaster } from "react-hot-toast";
import { getAttendenceMonthly } from "../../../api/Teachers/GetAttendanceMonthly";
import {
  UserDataInterFace,
  BatchDataInterFace,
  Attendance,
} from "./interfaces.attendance";
import ViewTable from "../../../components/View.attendance.table";

function removeDuplicateArrays<T>(arrays: T[][]): T[][] {
  const uniqueArrays: T[][] = [];
  const stringifiedArrays: string[] = [];

  for (const array of arrays) {
    const stringifiedArray = JSON.stringify(array);

    if (!stringifiedArrays.includes(stringifiedArray)) {
      stringifiedArrays.push(stringifiedArray);
      uniqueArrays.push(array);
    }
  }

  return uniqueArrays;
}

const DownloadAttendance = () => {
  const [isViewingTable, setIsViewingTable] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // all data from apis
  const [userData, setUserData] = useState<UserDataInterFace>();
  const [batchData, setBatchData] = useState<BatchDataInterFace[]>([]);

  // all dropdown arrays
  const [ussArray, setUssArray] = useState<string[]>([]);
  const [semesterArray, setSemesterArray] = useState<string[]>([]);
  const [branchArray, setBranchArray] = useState<string[]>([]);
  const [subjectsArray, setSubjectsArray] = useState<string[]>([]);
  const [batchArray, setBatchArray] = useState<string[]>([]);
  const monthArray: string[] = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // table array for table head and body
  const [tableHead, setTableHead] = useState<string[]>([]);
  const [tableBody, setTableBody] = useState<string[][]>();

  // all selected values by the user
  const [selectedUss, setSelectedUss] = useState<string>("Select USS");
  const [selectedBranch, setSelectedBranch] = useState<string>("Select Branch");
  const [selectedBatch, setSelectedBatch] = useState<string>("Select Batch");
  const [selectedSemester, setSelectedSemester] =
    useState<string>("Select Semester");
  const [selectedSubject, setSelectedSubject] =
    useState<string>("Select Subject");
  const [selectedMonth, setSelectedMonth] = useState<string>("Select Month");

  const getClasses = async () => {
    try {
      const response: UserDataInterFace = await generateClasses();
      response.success && setUserData(response);
      console.log("heello", userData);
      console.log(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const err = error as {
          ok?: boolean;
          status?: number;
          message?: string;
        };
        if (
          err &&
          !err.ok &&
          err.status &&
          err.status >= 400 &&
          err.status <= 500
        ) {
          console.log(err.message);
          alert(err.message);
        } else {
          console.log(error.message);
        }
      }
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  useEffect(() => {
    const filteredArray = batchData.reduce(
      (accumulator: BatchDataInterFace[], item) => {
        if (selectedSemester === item.semester) {
          accumulator.push(item);
        }
        return accumulator;
      },
      [] as BatchDataInterFace[]
    );
    setBranchArray([...new Set(filteredArray.map((item) => item.stream))]);
    selectedBranch !== "Select Branch" && setSelectedBranch("Select Branch");
    setSubjectsArray([]);
  }, [selectedSemester]);

  useEffect(() => {
    const filteredArray = batchData.reduce(
      (accumulator: BatchDataInterFace[], item) => {
        if (
          selectedSemester === item.semester &&
          selectedBranch === item.stream
        ) {
          accumulator.push(item);
        }
        return accumulator;
      },
      [] as BatchDataInterFace[]
    );
    setSubjectsArray(
      Array.from(new Set(filteredArray.map((item) => item.subject_name)))
    );
    selectedSubject !== "Select Subject" &&
      setSelectedSubject("Select Subject");
  }, [selectedBranch]);

  useEffect(() => {
    setButtonDisabled(true);
    const filteredArray = batchData.reduce(
      (accumulator: BatchDataInterFace[], item) => {
        if (
          selectedSemester === item.semester &&
          selectedBranch === item.stream &&
          selectedSubject === item.subject_name
        ) {
          accumulator.push(item);
        }
        return accumulator;
      },
      []
    );
    setBatchArray([
      ...new Set(
        filteredArray.map((item: BatchDataInterFace) => item.batch) as string[]
      ),
    ]);
    selectedBatch !== "Select Batch" && setSelectedBatch("Select Batch");
  }, [selectedSubject]);

  useEffect(() => {
    if (
      selectedBatch !== "Select Batch" &&
      selectedMonth !== "Select Month" &&
      selectedBranch !== "Select Branch" &&
      selectedSemester !== "Select Semester" &&
      selectedSubject !== "Select Subject" &&
      selectedUss !== "Select USS"
    ) {
      setButtonDisabled(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (userData?.success && userData.data.batchData) {
      setBatchData(userData.data.batchData);
      setUssArray([userData.data.school]);
      setSemesterArray([
        ...new Set(
          userData.data.batchData.map(
            (item: BatchDataInterFace) => item.semester
          )
        ),
      ]);
    }
  }, [userData]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const filteredData: BatchDataInterFace[] =
      userData?.data?.batchData?.filter(
        (item: BatchDataInterFace) =>
          item.stream === selectedBranch &&
          item.semester === selectedSemester &&
          item.batch === selectedBatch &&
          item.subject_name === selectedSubject
      ) || [];
    console.log(selectedBatch);
    console.log(batchData);
    console.log(filteredData);
    if (filteredData.length === 1) {
      const periodId = filteredData[0].period_id;
      const month = monthArray.indexOf(selectedMonth) + 1;
      console.log(periodId, month);
      try {
        const response = await getAttendenceMonthly(periodId, month);
        console.log(response);
        if (response.success) {
          console.log(response.result);
          const sortedTableHead = [
            "name",
            ...new Set(
              response.result.map((item: Attendance) => item.startedAt)
            ),
          ];

          const sortedTableBody = response.result.map((student: Attendance) => {
            const name = student.name;
            const enrollmentNo = student.enrollmentNo;
            const status = sortedTableHead.map((head, index) => {
              if (index === 0) {
                return name;
              } else {
                const correspondingEntry = response.result.find(
                  (item: Attendance) =>
                    item.name === name &&
                    item.enrollmentNo === enrollmentNo &&
                    item.startedAt === head
                );
                return correspondingEntry ? correspondingEntry.status : null;
              }
            });
            return status;
          });
          const formatDate = (timestamp: string) => {
            const options: Intl.DateTimeFormatOptions = {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            };
            return new Date(timestamp).toLocaleDateString("en-US", options);
          };

          const finalTableHead = (sortedTableHead as string[]).map(
            (item: string, index: number) => {
              if (index !== 0) {
                return formatDate(item);
              }
              return item;
            }
          );
          setTableHead(finalTableHead);
          console.log(finalTableHead);
          setTableBody(removeDuplicateArrays(sortedTableBody));
          setIsViewingTable(true);
          setIsLoading(false);
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
            setIsLoading(false);
            console.log(err.response?.data?.message);
            toast.error(err.response?.data?.message);
          } else {
            console.log(err);
            console.log(err);
          }
        }
      }
    }
  };

  return (
    <>
      <Toaster />
      {isViewingTable ? (
        <>
          <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row justify-center">
            <div className="flex justify-center items-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  setIsViewingTable(false);
                  setButtonDisabled(false);
                }}
              >
                back
              </button>
            </div>
            <div className="text-center p-2 font-bold">
              {selectedSubject}
              <br />
              {selectedBranch} - {selectedBatch}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <ViewTable
              tableHead={tableHead}
              tableBody={tableBody || []}
              className={selectedBranch + selectedBatch}
              month={selectedMonth}
            />
          </div>
        </>
      ) : (
        <div className="w-full h-fit">
          <div className="flex justify-center items-center flex-col gap-5 mb-20">
            <div className="font-bold text-2xl text-center w-72 mt-20">
              Select your class for to view and download attendance.
            </div>
            <Dropdown
              name={selectedUss}
              listItems={ussArray}
              onChange={(selectedValue) => setSelectedUss(selectedValue)}
            />
            <Dropdown
              name={selectedSemester}
              listItems={semesterArray}
              onChange={(selectedValue) => setSelectedSemester(selectedValue)}
            />
            <Dropdown
              name={selectedBranch}
              listItems={branchArray}
              onChange={(selectedValue) => setSelectedBranch(selectedValue)}
            />
            <Dropdown
              name={selectedSubject}
              listItems={subjectsArray}
              onChange={(selectedValue) => setSelectedSubject(selectedValue)}
            />
            <Dropdown
              name={selectedBatch}
              listItems={batchArray}
              onChange={(selectedValue) => setSelectedBatch(selectedValue)}
            />
            <Dropdown
              name={selectedMonth}
              listItems={monthArray}
              onChange={(selectedValue) => setSelectedMonth(selectedValue)}
            />
            {isLoading ? (
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
            ) : (
              <button
                disabled={buttonDisabled}
                type="submit"
                className={`h-12 lg:text-lg text-sm ${
                  buttonDisabled
                    ? "bg-[#cccccc]"
                    : "bg-[#004678] active:bg-[#E2F6FE]"
                }  text-white rounded-3xl w-60 lg:w-96 xl:w-96 `}
                onClick={() => handleSubmit()}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadAttendance;
