import { useCourses } from "../../../hooks/useCourses";
import { Zoom } from "react-awesome-reveal";
import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Chip, Tooltip } from "@mui/material";
import { useState } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Courses() {
    const { courses, error } = useCourses();

    const [searchTerm, setSearchTerm] = useState('');

    if (error) {
        return <div>Error loading courses: {error.message}</div>;
    }

    console.log(courses);

    const filteredCourses = courses.filter(course =>
        course.Course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.Lecturer.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    {filteredCourses.map((course) => (
                        <Collapse key={course.Course} in={true}>
                            <ListItem
                                disablePadding
                                className="shadow-md"
                                secondaryAction={
                                    <Chip
                                        deleteIcon={<AccessTimeIcon />}
                                        label={<div>{course.TimeToStart}</div>}
                                        color="primary"
                                        variant="outlined"
                                        className="w-36"
                                    />
                                }
                            >
                                <ListItemButton>
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
                                </ListItemButton>
                            </ListItem>
                        </Collapse>
                    ))}
                </List>
            </Box>
        </Zoom>
    );
}