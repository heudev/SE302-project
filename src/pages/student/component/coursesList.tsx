import { Box, List, ListItem, ListItemText, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { CourseInterface } from '../../../store/courses';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CoursesListProps {
    name: string;
}

const CoursesList = ({ name }: CoursesListProps) => {
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    
    const studentCourses = courses.filter(course => course.Students.includes(name));
    const filteredCourses = studentCourses.filter(course =>
        course.Course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.Lecturer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCourseClick = (courseName: string) => {
        navigate(`/coursePage/${courseName}`);
    };

    return (
        <Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search courses or lecturers..."
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
                {filteredCourses.map((course,index) => (
                    <ListItem
                        key={index}
                        onClick={() => handleCourseClick(course.Course)}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                            borderRadius: 1,
                            transition: 'background-color 0.2s'
                        }}
                    >
                        <ListItemText primary={course.Course} secondary={course.Lecturer} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default CoursesList;
