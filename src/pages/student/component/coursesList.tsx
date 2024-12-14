import { Box, List, ListItem, ListItemText, TextField, InputAdornment, IconButton, Button, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { setCourses, CourseInterface } from '../../../store/courses';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassroomInterface } from '../../../store/classrooms';

interface CoursesListProps {
    name: string;
}

const CoursesList = ({ name }: CoursesListProps) => {
    const dispatch = useDispatch();
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    const classrooms = useSelector((state: { classrooms: ClassroomInterface[] }) => state.classrooms);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAvailable, setShowAvailable] = useState(false);
    const navigate = useNavigate();
    
    const handleDelete = (courseName: string) => {
        const updatedCourses = courses.map(course => {
            if (course.Course === courseName) {
                return {
                    ...course,
                    Students: course.Students.filter(student => student !== name)
                };
            }
            return course;
        });
        dispatch(setCourses(updatedCourses));
    };

    const parseTimeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const getDay = (timeToStart: string): string => {
        return timeToStart.split(' ')[0];
    };

    const checkTimeConflict = (course1: CourseInterface, course2: CourseInterface): boolean => {
        const day1 = getDay(course1.TimeToStart);
        const day2 = getDay(course2.TimeToStart);

        // Eğer günler farklıysa çakışma yok
        if (day1 !== day2) return false;

        const start1 = parseTimeToMinutes(course1.TimeToStart.split(' ')[1]);
        const end1 = start1 + parseInt(course1.DurationInLectureHours) * 60;

        const start2 = parseTimeToMinutes(course2.TimeToStart.split(' ')[1]);
        const end2 = start2 + parseInt(course2.DurationInLectureHours) * 60;

        return (start1 < end2 && end1 > start2);
    };

    const getAvailableCourses = () => {
        const studentCourses = courses.filter(course => course.Students.includes(name));
        return courses.filter(course => {
            // Öğrenci zaten kayıtlı mı kontrol et
            if (course.Students.includes(name)) return false;
            
            // Sadece zaman çakışması kontrolü yap
            return !studentCourses.some(enrolled => checkTimeConflict(course, enrolled));
        });
    };

    const handleEnroll = (courseName: string) => {
        const updatedCourses = courses.map(course => {
            if (course.Course === courseName) {
                return {
                    ...course,
                    Students: [...course.Students, name]
                };
            }
            return course;
        });
        dispatch(setCourses(updatedCourses));
        setShowAvailable(false); // Kurs ekledikten sonra mevcut kurslara dön
    };

    const getAvailableSeats = (course: CourseInterface): number => {
        const classroom = classrooms.find(c => c.Classroom === course.Classroom);
        if (!classroom) return 0;
        return parseInt(classroom.Capacity) - course.Students.length;
    };

    const isClassroomFull = (course: CourseInterface): boolean => {
        return getAvailableSeats(course) <= 0;
    };

    const studentCourses = courses.filter(course => course.Students.includes(name));
    const filteredCourses = studentCourses.filter(course =>
        course.Course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.Lecturer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCourseClick = (courseName: string) => {
        navigate(`/coursePage/${courseName}`);
    };

    const displayedCourses = showAvailable 
        ? getAvailableCourses().filter(course =>
            course.Course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.Lecturer.toLowerCase().includes(searchTerm.toLowerCase()))
        : filteredCourses;

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search courses or lecturers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant={showAvailable ? "contained" : "outlined"}
                    onClick={() => setShowAvailable(!showAvailable)}
                    startIcon={showAvailable ? <ArrowBackIcon /> : <AddIcon />}
                >
                    {showAvailable ? "Back" : "Add"}
                </Button>
            </Box>
            <List sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 2, padding: 1, mt: 2 }}>
                {displayedCourses.map((course, index) => (
                    <ListItem
                        key={index}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                            borderRadius: 1,
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            opacity: showAvailable && isClassroomFull(course) ? 0.6 : 1
                        }}
                    >
                        <ListItemText 
                            primary={course.Course} 
                            secondary={
                                showAvailable 
                                    ? `${course.Lecturer} • Available Seats: ${getAvailableSeats(course)}`
                                    : course.Lecturer
                            }
                            onClick={() => handleCourseClick(course.Course)}
                        />
                        <Tooltip title={
                            showAvailable && isClassroomFull(course) 
                                ? "Class is full" 
                                : ""
                        }>
                            <span>
                                <IconButton 
                                    edge="end" 
                                    aria-label={showAvailable ? "add" : "delete"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showAvailable ? handleEnroll(course.Course) : handleDelete(course.Course);
                                    }}
                                    size="small"
                                    disabled={showAvailable && isClassroomFull(course)}
                                >
                                    {showAvailable ? <AddIcon /> : <CloseIcon />}
                                </IconButton>
                            </span>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default CoursesList;