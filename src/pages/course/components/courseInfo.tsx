import { Chip, Collapse, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClassroomIcon from '@mui/icons-material/Class';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { ClassroomInterface } from "../../../store/classrooms";
import { CourseInterface, updateCourseClassroom } from "../../../store/courses";

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
                    <Chip
                        icon={isHovered ? <EditIcon /> : <ClassroomIcon />}
                        label={isHovered ? '' : `Classroom: ${course.Classroom}`}
                        color={isHovered ? "primary" : "default"}
                        className="w-full transition-colors duration-200"
                        variant={isHovered ? "filled" : "outlined"}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsOpen(!isOpen)}
                        sx={{
                            '& .MuiChip-icon': {
                                color: isHovered ? 'white' : 'inherit',
                                margin: isHovered ? '0' : '0 8px 0 12px',
                                position: isHovered ? 'absolute' : 'static',
                                left: '50%',
                                transform: isHovered ? 'translateX(-50%)' : 'none',
                            },
                            position: 'relative',
                            justifyContent: isHovered ? 'center' : 'flex-start',
                            '& .MuiChip-label': {
                                paddingLeft: isHovered ? 0 : '0',
                            }
                        }}
                    />
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
