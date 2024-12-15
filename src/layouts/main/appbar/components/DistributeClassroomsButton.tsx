import { useDispatch, useSelector } from 'react-redux';
import { updateCourseClassroom } from '../../../../store/courses';
import { ClassroomInterface } from '../../../../store/classrooms';
import { CourseInterface } from '../../../../store/courses';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';

export default function DistributeClassroomsButton() {
    const dispatch = useDispatch();
    const classrooms = useSelector((state: { classrooms: ClassroomInterface[] }) => state.classrooms);
    const allCourses = useSelector((state: { courses: CourseInterface[] }) => state.courses);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
    });


    const parseTimeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const getDay = (timeToStart: string): string => {
        return timeToStart.split(' ')[0];
    };

    const hasTimeConflict = (schedules: CourseInterface[], newCourse: CourseInterface): boolean => {
        const newStart = parseTimeToMinutes(newCourse.TimeToStart.split(' ')[1]);
        const newEnd = newStart + parseInt(newCourse.DurationInLectureHours) * 60;
        const newDay = getDay(newCourse.TimeToStart);

        return schedules.some(schedule => {
            const scheduleDay = getDay(schedule.TimeToStart);

            if (newDay !== scheduleDay) return false;

            const scheduleStart = parseTimeToMinutes(schedule.TimeToStart.split(' ')[1]);
            const scheduleEnd = scheduleStart + parseInt(schedule.DurationInLectureHours) * 60;
            return (newStart < scheduleEnd && newEnd > scheduleStart);
        });
    };

    const handleDistributeClassrooms = () => {
        try {
            const classroomSchedules: Record<string, CourseInterface[]> = {};

            const sortedCourses = [...allCourses].sort((a, b) =>
                b.Students.length - a.Students.length
            );

            sortedCourses.forEach(course => {
                const suitableClassroom = classrooms
                    .filter(classroom => {
                        const hasCapacity = parseInt(classroom.Capacity) >= course.Students.length;
                        const scheduledCourses = classroomSchedules[classroom.Classroom] || [];
                        const hasNoConflict = !hasTimeConflict(scheduledCourses, course);
                        return hasCapacity && hasNoConflict;
                    })
                    .sort((a, b) => parseInt(a.Capacity) - parseInt(b.Capacity))[0];

                if (suitableClassroom) {
                    if (!classroomSchedules[suitableClassroom.Classroom]) {
                        classroomSchedules[suitableClassroom.Classroom] = [];
                    }
                    classroomSchedules[suitableClassroom.Classroom].push(course);

                    dispatch(updateCourseClassroom({
                        courseName: course.Course,
                        classroom: suitableClassroom.Classroom
                    }));
                } else {
                    console.warn(`No suitable classroom found for course: ${course.Course}`);
                }
            });

            setSnackbar({
                open: true,
                message: "Classrooms successfully assigned to courses"
            });
        } catch (error) {
            console.error("An error occurred while arranging classrooms:", error);
            setSnackbar({
                open: true,
                message: "An error occurred while arranging classrooms"
            });
        }
    };

    return (
        <div>
            <Button
                onClick={handleDistributeClassrooms}
                color="error"
                variant="contained"
                className='w-32'
            >
                Distribute
            </Button>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={1000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </div>
    );
}