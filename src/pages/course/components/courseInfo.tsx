import { Chip } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClassroomIcon from '@mui/icons-material/Class';
import GroupIcon from '@mui/icons-material/Group';

interface CourseInfoProps {
    Course: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Lecturer: string;
    Students: string[];
    Classroom: string;
}

export function CourseInfo({ course }: { course: CourseInfoProps }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Time */}
            <div className="w-full">
                <Chip
                    icon={<AccessTimeIcon />}
                    label={`Start Time: ${course.TimeToStart}`}
                    color="primary"
                    className="w-full"
                    variant="outlined"
                />
            </div>

            {/* Duration */}
            <div className="w-full">
                <Chip
                    label={`Duration: ${course.DurationInLectureHours} hrs`}
                    color="secondary"
                    className="w-full"
                    variant="outlined"
                />
            </div>

            {/* Classroom */}

            <div className="w-full">
                <Chip
                    icon={<ClassroomIcon />}
                    label={`Classroom: ${course.Classroom}`}
                    color="default"
                    className="w-full"
                    variant="outlined"
                />
            </div>

            {/* Students */}
            <div className="w-full">
                <Chip
                    icon={<GroupIcon />}
                    label={`Students: ${course.Students.length}`}
                    color="success"
                    className="w-full"
                    variant="outlined"
                />
            </div>
        </div>
    );
}
