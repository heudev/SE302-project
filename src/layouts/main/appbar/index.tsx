import { useState, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IeuLogo from "../../../assets/ieu-logo.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCourseClassroom } from '../../../store/courses';
import { ClassroomInterface } from '../../../store/classrooms';
import { CourseInterface } from '../../../store/courses';
import Snackbar from '@mui/material/Snackbar';

export default function AppBarComponent() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const classrooms = useSelector((state: { classrooms: ClassroomInterface[] }) => state.classrooms);
    const allCourses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };
    
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

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
            
            // If days are different, there's no conflict
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
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <img 
                        src={IeuLogo} 
                        alt="IEU Timetable" 
                        width={40} 
                        className='me-3' 
                        onContextMenu={e => e.preventDefault()} 
                        draggable="false" 
                        onClick={handleLogoClick} 
                        style={{ cursor: 'pointer' }} 
                    />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        IEU.APP v2
                    </Typography>
                    <Button color="inherit" onClick={handleDistributeClassrooms}>Distribute</Button>
                    <Button color="inherit" onClick={handleImportClick} sx={{ ml: 2 }}>Import</Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </Toolbar>
            </AppBar>
            {selectedImage && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img src={selectedImage} alt="Imported" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                </Box>
            )}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={1000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </Box>
    );
}