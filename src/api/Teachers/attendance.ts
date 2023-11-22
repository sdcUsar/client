import axios from 'axios';
import { Student } from '../../Pages/TeacherAdmin/AttendancePages/interfaces.attendance';

const BASE_URL = "https://ams-x5ws.onrender.com";

function convertTime(t: string): Date {
    const d = new Date();
    const [hours, minutes] = t.split(':').map(x => parseInt(x));
    d.setHours(hours);
    d.setMinutes(minutes);
    return d;
}

export async function markAttendance(val: Student[], startedAt: string, endedAt: string, period_id: number) {
    const tokenWithQuotes: string = localStorage.getItem("token") ?? "";
    const token = tokenWithQuotes.replace(/"/g, "");
    const body = {
        startedAt: convertTime(startedAt),
        endedAt: convertTime(endedAt),
        period_id,
        student_ids: val.map((x) => {
            return {
                id: x.id,
                'status': x.status ?? 'absent'
            };
        }),
    };
    const response = await axios.post(`${BASE_URL}/markingattendance`,
        body,
        {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    return response;
}
