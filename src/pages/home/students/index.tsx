import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Chip, Tooltip } from "@mui/material";
import { Zoom } from "react-awesome-reveal";

interface Student {
    Name: string;
}
interface Course {
    Course: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Lecturer: string;
    Students: string[];
    Classroom: string;
}

export default function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const courses = useSelector((state: { courses: Course[] }) => state.courses);
    const navigate = useNavigate();

    useEffect(() => {
        const allStudents = courses.flatMap((course: Course) => course.Students);
        const distinctStudents = Array.from(new Set(allStudents)).map((name) => ({ Name: name }));
        setStudents(distinctStudents);
    }, [courses]);

    const filteredStudents = students.filter(student => {
        const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
        return searchTerms.every(term => student.Name.toLowerCase().includes(term));
    });

    return (
        <Zoom style={{ width: '100%', maxWidth: 380 }} delay={400} triggerOnce={true}>
            <Box sx={{ bgcolor: 'background.paper' }} className='shadow-2xl rounded'>
                <TextField
                    type="search"
                    label={searchTerm === '' ? 'Search by Student Name' : 'Search results'}
                    variant="filled"
                    autoComplete='off'
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Divider />
                <List sx={{ overflowY: 'auto', height: 500 }}>
                    {filteredStudents.map((student) => (
                        <Collapse key={student.Name} in={true}>
                            <ListItem disablePadding className="shadow-md">
                                <ListItemButton onClick={() => navigate(`/student/${student.Name}`)}>
                                    <Tooltip title={`Student`} arrow>
                                        <Chip
                                            className='me-2'
                                            color="secondary"
                                            label="Student"
                                        />
                                    </Tooltip>
                                    <ListItemText
                                        primary={student.Name}
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