import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";



interface CourseInterface {
    Course: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Lecturer: string;
    Students: string[];
    Classroom: string;
}

interface WeeklyTableProps {
    selectedCourses: CourseInterface[];
}

const timeSlots = [
    { start: '08:30' },
    { start: '09:25' },
    { start: '10:20' },
    { start: '11:15' },
    { start: '12:10' },
    { start: '13:05' },
    { start: '14:00' },
    { start: '14:55' },
    { start: '15:50' },
    { start: '16:45' },
    { start: '17:40' },
    { start: '18:35' },
    { start: '19:30' },
];
  
const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

function mapCoursesToTimetable(courses: CourseInterface[]) {
    const timeTable = Array.from({ length: 7 }, () => new Array(13).fill(null));
    courses.forEach(course => {
        const [dayName, time] = course.TimeToStart.split(' ');
        const dayIndex = daysOfWeek.indexOf(dayName);

        // Find the index of the time slot in timeSlots
        const timeSlotIndex = timeSlots.findIndex(slot => slot.start === time);    const duration = parseInt(course.DurationInLectureHours, 10);

        for (let i = 0; i < duration; i++) {
            timeTable[dayIndex][timeSlotIndex + i] = {
            course: course.Course,
            lecturer: course.Lecturer,
            classroom: course.Classroom,
            };
        }   
    });
    return timeTable;
}

export function WeeklyTable({ selectedCourses }: WeeklyTableProps) {

    const courseTimeTable = mapCoursesToTimetable(selectedCourses);
    

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        {daysOfWeek.map((day, index) => (
                            <TableCell key={index}>{day}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {timeSlots.map((slot, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell>{slot.start}</TableCell>
                            {courseTimeTable.map((day, colIndex) => (
                                <TableCell key={colIndex}>
                                    {day[rowIndex] ? (
                                        <>
                                            <strong>{day[rowIndex].course}</strong>
                                            <div>{day[rowIndex].lecturer}</div>
                                        </>
                                    ) : (
                                        null
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}