import { Chip, Collapse, List, ListItem, ListItemButton, ListItemText, Box } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClassroomIcon from '@mui/icons-material/Class';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { ClassroomInterface } from "../../../store/classrooms";
import { CourseInterface, updateCourseClassroom } from "../../../store/courses";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

interface CourseInfoProps {
    Course: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Lecturer: string;
    Students: string[];
    Classroom: string;
}

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

export function CourseInfo({ course }: { course: CourseInfoProps }) {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    
    const classrooms = useSelector((state: { classrooms: ClassroomInterface[] }) => state.classrooms);
    const allCourses = useSelector((state: { courses: CourseInterface[] }) => state.courses);

    const availableClassrooms = classrooms.filter(room => {
        const hasEnoughCapacity = parseInt(room.Capacity) >= course.Students.length;
        
        const coursesInRoom = allCourses.filter(c => c.Classroom === room.Classroom && c.Course !== course.Course);
        const hasTimeConflictInRoom = hasTimeConflict(coursesInRoom, {
            Course: course.Course,
            TimeToStart: course.TimeToStart,
            DurationInLectureHours: course.DurationInLectureHours,
            Classroom: room.Classroom,
            Students: course.Students
        } as CourseInterface);

        return hasEnoughCapacity && !hasTimeConflictInRoom;
    });

    const handleClassroomSelect = (selectedRoom: string) => {
        dispatch(updateCourseClassroom({
            courseName: course.Course,
            classroom: selectedRoom
        }));
        setIsOpen(false);
    };

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
                <div className="relative">
                    <Box
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        sx={{
                            position: 'relative',
                            height: '32px', // Standard Chip height
                            width: '100%'
                        }}
                    >
                        <Chip
                            icon={<ClassroomIcon />}
                            label={`Classroom: ${course.Classroom}`}
                            color="default"
                            className="w-full"
                            variant="outlined"
                            sx={{
                                display: isHovered ? 'none' : 'flex',
                                position: 'absolute',
                                width: '100%'
                            }}
                        />
                        {isHovered && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    border: '1px solid rgba(0, 0, 0, 0.23)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    bgcolor: 'rgba(0, 0, 0, 0.8)'  // Changed back to dark background
                                }}
                            >
                                <Box
                                    onClick={course.Classroom !== "unknown" ? () => navigate(`/classroom/${course.Classroom}`) : undefined}
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: course.Classroom !== "unknown" ? 'pointer' : 'not-allowed',
                                        '&:hover': course.Classroom !== "unknown" ? { 
                                            bgcolor: 'rgba(255, 255, 255, 0.1)' 
                                        } : {},
                                        color: course.Classroom !== "unknown" ? 'white' : 'rgba(255, 255, 255, 0.3)',
                                    }}
                                >
                                    <VisibilityIcon fontSize="small" />
                                </Box>
                                <Box
                                    sx={{
                                        width: '1px',
                                        bgcolor: 'rgba(255, 255, 255, 0.2)'
                                    }}
                                />
                                <Box
                                    onClick={() => setIsOpen(!isOpen)}
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                                        color: 'white'
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </Box>
                            </Box>
                        )}
                    </Box>
                    <Collapse in={isOpen}>
                        <List sx={{
                            maxHeight: 200,
                            overflowY: 'auto',
                            bgcolor: 'background.paper',
                            position: 'absolute',
                            width: '100%',
                            zIndex: 1000,
                        }} className="border rounded shadow-md">
                            <ListItem>
                                <ListItemText 
                                    primary={`Available Classrooms (${availableClassrooms.length})`}
                                    className="text-gray-600 border-b pb-2"
                                />
                            </ListItem>
                            {availableClassrooms.length > 0 ? (
                                availableClassrooms.map((room) => (
                                    <ListItem key={room.Classroom} disablePadding>
                                        <ListItemButton onClick={() => {
                                            handleClassroomSelect(room.Classroom);
                                        }}>
                                            <ListItemText 
                                                primary={room.Classroom} 
                                                secondary={`Capacity: ${room.Capacity}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText 
                                        primary="No available classrooms" 
                                        secondary="All rooms are either occupied or too small" 
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Collapse>
                </div>
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
