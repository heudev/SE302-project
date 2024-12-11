import { Chip } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import TimerIcon from '@mui/icons-material/Timer';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useSelector } from 'react-redux';
import { CourseInterface } from '../../../store/courses';

interface ClassroomProps {
    Classroom: string;
    Capacity: string;
}

export function ClassroomInfo({ classroom }: { classroom: ClassroomProps }) {
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    
    // Calculate totals
    const classroomCourses = courses.filter(course => course.Classroom === classroom.Classroom);
    const totalCourses = classroomCourses.length;
    const totalHours = classroomCourses.reduce((sum, course) => 
        sum + parseInt(course.DurationInLectureHours), 0);
    
    // Calculate available hours (assuming 40 hours per week maximum)
    const availableHours = 40 - totalHours;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
                <Chip
                    icon={<GroupIcon />}
                    label={`Capacity: ${classroom.Capacity}`}
                    color="secondary"
                    className="w-full"
                    variant="outlined"
                />
            </div>

            <div className="w-full">
                <Chip
                    icon={<SchoolIcon />}
                    label={`Total Courses: ${totalCourses}`}
                    color="default"
                    className="w-full"
                    variant="outlined"
                />
            </div>

            <div className="w-full">
                <Chip
                    icon={<TimerIcon />}
                    label={`Total Hours: ${totalHours}`}
                    color="success"
                    className="w-full"
                    variant="outlined"
                />
            </div>

            <div className="w-full">
                <Chip
                    icon={<EventAvailableIcon />}
                    label={`Available Hours: ${availableHours}`}
                    color="primary"
                    className="w-full"
                    variant="outlined"
                />
            </div>
        </div>
    );
}
