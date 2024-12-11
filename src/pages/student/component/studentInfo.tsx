import React from 'react';
import { Chip } from "@mui/material";
import EventNoteIcon from '@mui/icons-material/EventNote';
import TimerIcon from '@mui/icons-material/Timer';
import { useSelector } from 'react-redux';
import { CourseInterface } from '../../../store/courses';

interface StudentInfoProps {
    name: string;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ name }) => {
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    
    // Calculate totals
    const studentCourses = courses.filter(course => course.Students.includes(name));
    const totalCourses = studentCourses.length;
    const totalHours = studentCourses.reduce((sum, course) => 
        sum + parseInt(course.DurationInLectureHours), 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
                <Chip
                    icon={<EventNoteIcon />}
                    label={`Total Courses: ${totalCourses}`}
                    color="secondary"
                    className="w-full"
                    variant="outlined"
                />
            </div>

            <div className="w-full">
                <Chip
                    icon={<TimerIcon />}
                    label={`Total Course Hours: ${totalHours}`}
                    color="success"
                    className="w-full"
                    variant="outlined"
                />
            </div>
        </div>
    );
};

export default StudentInfo;
