import { useState, useEffect } from "react";
import Dropdown from "../../../components/Dropdown";
import { generateClasses } from "../../../api/Teachers/GenerateClasses";
import { getTimeStamps } from "../../../api/Teachers/GetAttendanceMonthly";
import {
  UserDataInterFace,
  BatchDataInterFace,
  SelectedDataInterface,
} from "./interfaces.attendance";
// import Table from "../../../components/Take.attendance.table";

// interface StudentInterface {
//   id: number;
//   enrollmentNo: string;
//   name: string;
//   email: string;
// }

const DownloadAttendance = () => {
  const [isViewingTable, setIsViewingTable] = useState<boolean>(false);

  // all data from apis
  const [userData, setUserData] = useState<UserDataInterFace>();
  const [batchData, setBatchData] = useState<BatchDataInterFace[]>([]);

  // all dropdown arrays
  const [ussArray, setUssArray] = useState<string[]>([]);
  const [semesterArray, setSemesterArray] = useState<string[]>([]);
  const [branchArray, setBranchArray] = useState<string[]>([]);
  const [subjectsArray, setSubjectsArray] = useState<string[]>([]);
  const [batchArray, setBatchArray] = useState<string[]>([]);

  // const [studentsArray, setStudentsArray] = useState<StudentInterface[]>([]);

  // all selected values by the user
  const [selectedUss, setSelectedUss] = useState<string>("Select USS");
  const [selectedBranch, setSelectedBranch] = useState<string>("Select Branch");
  const [selectedBatch, setSelectedBatch] = useState<string>("Select Batch");
  const [selectedSemester, setSelectedSemester] =
    useState<string>("Select Semester");
  const [selectedSubject, setSelectedSubject] =
    useState<string>("Select Subject");

  // final data to be sent to the api with batch id
  const [selectedData, setSelectedData] = useState<SelectedDataInterface>({
    uss: "",
    branch: "",
    batch: "",
    semester: "",
    subject: "",
    month: "",
  });

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
    setSelectedData({
      uss: selectedUss,
      branch: selectedBranch,
      batch: selectedBatch,
      semester: selectedSemester,
      subject: selectedSubject,
    });
    console.log(selectedData);
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
      try {
        const response = await getTimeStamps(periodId);
        console.log(response);
        setIsViewingTable(true);
        // setStudentsArray([
        //   {
        //     id: 1,
        //     enrollmentNo: "074",
        //     name: "ayush",
        //     email: "ayush@ipua.c.in",
        //   },
        // ]);
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
    }
  };

  return (
    <>
      {isViewingTable ? (
        <div className="flex justify-center items-center">
          {/* <Table
            tableHead={["Enrollnment Number", "Name", "Email"]}
            tableBody={studentsArray}
            checkbox={true}
            onChange={(selectedValue) => console.log(selectedValue)}
            deleteButton={false}
          /> */}
        </div>
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
            <button
              type="submit"
              className="h-12 lg:text-lg text-sm bg-[#004678] text-white rounded-3xl w-60 lg:w-96 xl:w-96 active:bg-[#E2F6FE]"
              onClick={() => handleSubmit()}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadAttendance;
