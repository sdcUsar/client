export interface Subject {
    Subject_id: number;
    subject_code: string;
    subject_name: string;
    subject_type: string;
}

export interface EmployeeDetailsResponse {
    success: boolean;
    token: string;
    employeeDetails: {
        instructor_id: string;
        dateCreated: number;
        name: string;
        school: string;
        designation: string;
        email: string;
        phone: string;
        subjects: Subject[];
    };
}

export interface OtpResponse {
    success: boolean;
    message: string;
}

// UserResponse.ts

export interface StudentDetailsResponse {
    success: boolean;
    token: string;
    result: {
        id: number;
        name: string;
        enrollment_no: string;
        email: string;
        phone: string;
        year_of_admission: number;
        password: string;
        course_id: number;
        otp: number;
    };
}
