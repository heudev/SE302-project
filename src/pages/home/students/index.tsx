import { useState, useEffect } from "react";
import { openDB } from "idb";
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
    Classroom?: string;
}

export default function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDistinctStudents = async () => {
            try {
                const db = await openDB("coursesDB", 1);
                const courses = await db.getAll("courses");

                const allStudents = courses.flatMap((course: Course) => course.Students);
                const distinctStudents = Array.from(new Set(allStudents)).map((name) => ({ Name: name }));

                setStudents(distinctStudents);
            } catch (err) {
                console.error("Error fetching students:", err);
                setError("Failed to load students from the database.");
            }
        };

        fetchDistinctStudents();
    }, []);

    if (error) {
        console.log(error);
        return <div>Error loading students: {error}</div>;
    }

    const filteredStudents = students.filter(student =>
        student.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Zoom style={{ width: '100%', maxWidth: 380 }} delay={700} triggerOnce={true}>
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
                                <ListItemButton>
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
