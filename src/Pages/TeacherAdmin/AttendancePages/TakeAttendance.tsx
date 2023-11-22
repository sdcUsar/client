import { useState, useEffect } from "react";
import Dropdown from "../../../components/Dropdown";
import Table from "../../../components/Take.attendance.table";
import { generateClasses } from "../../../api/Teachers/GenerateClasses";
import { getStudents } from "../../../api/Teachers/GetStudents";
import "../../../components/componentsStyle.css";
import {
  BatchDataInterFace,
  SelectedDataInterface,
  Student,
  UserDataInterFace,
} from "./interfaces.attendance";
import { markAttendance } from "../../../api/Teachers/attendance";
import toast, { Toaster } from "react-hot-toast";

const TakeAttendance = () => {
  const [isMarkingTime, setIsMarkingTime] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // all data from apis
  const [userData, setUserData] = useState<UserDataInterFace>();
  const [batchData, setBatchData] = useState<BatchDataInterFace[]>([]);
  const [periodId, setPeriodId] = useState<number | null>(null);

  // all dropdown arrays
  const [ussArray, setUssArray] = useState<string[]>([]);
  const [semesterArray, setSemesterArray] = useState<string[]>([]);
  const [branchArray, setBranchArray] = useState<string[]>([]);
  const [subjectsArray, setSubjectsArray] = useState<string[]>([]);
  const [batchArray, setBatchArray] = useState<string[]>([]);
  const [studentsArray, setStudentsArray] = useState<Student[]>([]);

  // all selected values by the user
  const [selectedUss, setSelectedUss] = useState<string>("Select USS");
  const [selectedBranch, setSelectedBranch] = useState<string>("Select Branch");
  const [selectedBatch, setSelectedBatch] = useState<string>("Select Batch");
  const [selectedSemester, setSelectedSemester] =
    useState<string>("Select Semester");
  const [selectedSubject, setSelectedSubject] =
    useState<string>("Select Subject");
  const [selectedStartingTime, setSelectedStartingTime] = useState<string>(
    new Date().toTimeString().slice(0, 5)
  );
  const [selectedEndingTime, setSelectedEndingTime] = useState<string>("");

  // final data to be sent to the api with batch id
  const [selectedData, setSelectedData] = useState<SelectedDataInterface>();

  useEffect(() => {
    const getClasses = async () => {
      try {
        const response: UserDataInterFace = await generateClasses();
        response.success && setUserData(response);
        console.log("heello", userData);
        console.log("heello", response);
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
    getClasses();
  }, []);

  useEffect(() => {
    console.log(batchData);
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
    console.log(selectedSemester, selectedBranch, selectedSubject);
    console.log(batchData);
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
      selectedBranch !== "Select Branch" &&
      selectedSemester !== "Select Semester" &&
      selectedSubject !== "Select Subject" &&
      selectedUss !== "Select USS"
    ) {
      setButtonDisabled(false);
    }
  }, [selectedBatch]);

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

  useEffect(() => {
    const [hours, minutes] = selectedStartingTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setHours(date.getHours() + 1);

    const newTime =
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0");

    setSelectedEndingTime(newTime);
  }, [selectedStartingTime]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setSelectedData({
      uss: selectedUss,
      branch: selectedBranch,
      batch: selectedBatch,
      semester: selectedSemester,
      subject: selectedSubject,
      startingTime: selectedStartingTime,
      endingTime: selectedEndingTime,
    });
    console.log(selectedData);
    const filteredData: BatchDataInterFace[] =
      batchData.filter(
        (item: BatchDataInterFace) =>
          item.stream === selectedBranch &&
          item.semester === selectedSemester &&
          item.batch === selectedBatch &&
          item.subject_name === selectedSubject
      ) || [];
    if (filteredData.length === 1) {
      const batchID = filteredData[0].batch_id;
      try {
        const response = await getStudents(batchID);
        console.log(response);
        if (response.success) {
          console.log(response.result);
          setStudentsArray(response.result);
          setPeriodId(filteredData[0].period_id);
          setIsMarkingTime(true);
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

  const onAttendanceSubmit = async (val: Student[]) => {
    const res = await markAttendance(
      val,
      selectedStartingTime,
      selectedEndingTime,
      periodId!
    );
    console.log(res);
    toast.success("Attendance submitted successfully", {
      duration: 5000,
    });
    setIsMarkingTime(false);
    setButtonDisabled(true);
    setIsLoading(false);
    setSelectedSemester("Select Semester");
    setSelectedBranch("Select Branch");
    setSelectedSubject("Select Subject");
    setSelectedBatch("Select Batch");
    setSelectedUss("Select USS");
  };

  return (
    <>
      <Toaster />
      {isMarkingTime ? (
        <>
          <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row justify-center">
            <div className="flex justify-center gap-4 items-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  setIsMarkingTime(false);
                  setButtonDisabled(false);
                  setIsLoading(false);
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
            <Table
              tableHead={["Enrollnment Number", "Name", "Email"]}
              tableBody={studentsArray}
              checkbox={true}
              onSubmit={(v) => onAttendanceSubmit(v)}
              deleteButton={false}
            />
          </div>
        </>
      ) : (
        <div className="w-full h-fit">
          <div className="flex justify-center items-center flex-col gap-5 mb-20">
            <div className="font-bold text-2xl text-center w-72 mt-20">
              Select your class for taking attendance
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
            <div className="flex justify-between w-60 lg:w-96 xl:w-96">
              <div>
                Starting Time
                <input
                  type="time"
                  name=""
                  id=""
                  onChange={(e) => {
                    setSelectedStartingTime(e.target.value);
                  }}
                  value={selectedStartingTime}
                  className=" flex justify-evenly p-2 text-center font-bold bg-[#041d55] text-white rounded-lg w-24 lg:w-44 xl:w-44"
                />
              </div>
              <div className="">
                Ending Time
                <input
                  type="time"
                  name=""
                  id=""
                  value={selectedEndingTime}
                  className=" flex justify-evenly p-2 text-center font-bold bg-[#041d55] text-white rounded-lg w-24 lg:w-44 xl:w-44"
                />
              </div>
            </div>
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

export default TakeAttendance;
