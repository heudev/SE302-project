import { useEffect, useState } from "react";
import { Zoom } from "react-awesome-reveal";
import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Chip, Tooltip } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from "react-router-dom";
import { getAllItems } from "../../../database/tables/courses";

type Course = {
    Course: string;
    Lecturer: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Classroom?: string;
    Students: string[];
};

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getAllItems();
                setCourses(courses);
            } catch (err) {
                setError('Error loading courses');
                console.error(err);
            }
        };
        const timer = setTimeout(fetchCourses, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (error) {
        console.log(error);
        return <div>Error loading courses: {error}</div>;
    }

    const filteredCourses = courses.filter((course: Course) =>
        course.Course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.Lecturer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //route navigation
    const handleCourseClick = (courseId: string) => {
        navigate(`/coursePage/${courseId}`);
    };

    return (
        <Zoom style={{ width: '100%', maxWidth: 380 }} delay={700} triggerOnce={true}>
            <Box sx={{ bgcolor: 'background.paper' }} className='shadow-2xl rounded'>
                <TextField
                    type="search"
                    label={searchTerm === '' ? 'Search by Course or Lecturer' : 'Search results'}
                    variant="filled"
                    autoComplete='off'
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Divider />
                <List sx={{ overflowY: 'auto', height: 500 }}>
                    {filteredCourses.map((course: Course, index) => (
                        <Collapse key={`${course.Course}-${index}`} in={true}>
                            <ListItem
                                disablePadding
                                className="shadow-md"
                            >
                                <ListItemButton
                                    sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                                    onClick={() => handleCourseClick(course.Course)}
                                >
                                    {/* Left side */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Tooltip title={`Duration in lecture hours`} arrow>
                                            <Chip
                                                className='me-2'
                                                color="secondary"
                                                label={course.DurationInLectureHours}
                                            />
                                        </Tooltip>
                                        <ListItemText
                                            primary={course.Course}
                                            secondary={course.Lecturer}
                                        />
                                    </Box>

                                    {/* Right side */}
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Chip
                                            deleteIcon={<AccessTimeIcon />}
                                            label={course.TimeToStart}
                                            color="primary"
                                            variant="outlined"
                                            className="w-36"
                                        />
                                        {course.Classroom && (
                                            <Chip
                                                label={course.Classroom}
                                                color="secondary"
                                                className="w-36"
                                            />
                                        )}
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        </Collapse>
                    ))}
                </List>
            </Box>
        </Zoom>
    );
}
