export interface SelectedDataInterface {
    uss: string;
    branch: string;
    batch: string;
    semester: string;
    subject: string;
    month?: string;
    startingTime?: string
    endingTime?: string;
}

export interface BatchDataInterFace {
    period_id: number;
    batch_id: number;
    subject_code: string;
    subject_name: string;
    subject_type: string;
    course: string;
    stream: string;
    semester: string;
    batch: string;
}

export interface UserDataInterFace {
    success: boolean;
    data: {
        user: string;
        batchData: BatchDataInterFace[];
        school: string;
    };
}

export interface Attendance {
    id: number;
    enrollmentNo: string;
    name: string;
    status: string;
    startedAt: string;
    endedAt: string;
}

export interface AttendanceApiResponse {
    success: boolean;
    message: string;
    result: Attendance[];
}

export interface Student {
    id: number;
    enrollmentNo: string;
    name: string;
    email: string;
    status?: string;
}

export interface Subject {
    Subject_id: number;
    subject_code: string;
    subject_name: string;
    subject_type: string;
}

export interface EmployeeDetails {
    instructor_id: string;
    dateCreated: number;
    name: string;
    school: string;
    designation: string;
    email: string;
    phone: string;
    subjects: Subject[];
}
