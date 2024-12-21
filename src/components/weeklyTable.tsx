import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";



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

        const timeSlotIndex = timeSlots.findIndex(slot => slot.start === time);
        const duration = parseInt(course.DurationInLectureHours, 10);

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
        <TableContainer 
        component={Paper}
        sx={{
            boxShadow: 3,
            borderRadius: 2,
            overflowX: 'auto',
            maxWidth: '100vw',
            '& .MuiTable-root': {
                minWidth: {
                    xs: '800px',
                    md: '650px'
                }
            }
        }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell 
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#f5f5f5',
                                textAlign: 'center',
                                fontSize: '1.1rem',
                                padding: '8px'
                            }}
                        >
                            Time
                        </TableCell>
                        {daysOfWeek.map((day, index) => (
                            <TableCell 
                                key={index} 
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    textAlign: 'center',
                                    fontSize: '1rem',
                                    padding: '8px',
                                }}
                            >
                                {day}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {timeSlots.map((slot, rowIndex) => (
                        <TableRow
                            key={rowIndex}
                            sx={{
                                backgroundColor: rowIndex % 2 === 0 ? '#fafafa' : '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#e3f2fd',
                                },
                                height: '70px'
                            }}
                        >
                            <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center'}}>
                                {slot.start}
                            </TableCell>
                            {courseTimeTable.map((day, colIndex) => (
                                <TableCell key={colIndex} sx={{ padding: '8px', textAlign: 'center' }}>
                                    {day[rowIndex] ? (
                                        <div>
                                            <strong>
                                                {day[rowIndex].course}
                                            </strong>
                                            <div style={{ color: '#757575', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                                {day[rowIndex].lecturer}
                                            </div>
                                            <div style={{ color: '#757575', fontSize: '0.6rem' }}>
                                                {day[rowIndex].classroom}
                                            </div>
                                        </div>
                                    ) : null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}