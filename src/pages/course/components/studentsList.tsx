import { List, ListItem, ListItemText, TextField, InputAdornment, IconButton } from "@mui/material";
import { Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setCourses, CourseInterface } from '../../../store/courses';

interface StudentsListProps {
    students: string[];
    courseId: string;
}

export function StudentsList({ students, courseId }: StudentsListProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);

    const handleDelete = (studentToDelete: string) => {
        const updatedCourses = courses.map(course => {
            if (course.Course === courseId) {
                return {
                    ...course,
                    Students: course.Students.filter(student => student !== studentToDelete)
                };
            }
            return course;
        });
        dispatch(setCourses(updatedCourses));
    };

    const filteredStudents = students.filter(student => 
        student.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStudentClick = (studentName: string) => {
        navigate(`/student/${studentName}`);
    };

    return (
        <div>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ mt: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <List sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 2, padding: 1, mt: 2 }}>
                {filteredStudents.map((student, index) => (
                    <Collapse key={index} in={true}>
                        <ListItem 
                            disablePadding 
                            sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                                borderRadius: 1,
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <ListItemText 
                                primary={student} 
                                onClick={() => handleStudentClick(student)}
                            />
                            <IconButton 
                                edge="end" 
                                aria-label="delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(student);
                                }}
                                size="small"
                            >
                                <CloseIcon />
                            </IconButton>
                        </ListItem>
                    </Collapse>
                ))}
            </List>
        </div>
    );
}
