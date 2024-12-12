import { Box, List, ListItem, ListItemText, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setCourses, CourseInterface } from '../../../store/courses';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CoursesListProps {
    name: string;
}

const CoursesList = ({ name }: CoursesListProps) => {
    const dispatch = useDispatch();
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    const [searchTerm, setSearchTerm] = useState("");
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
                            primary={course.Course} 
                            secondary={course.Lecturer}
                            onClick={() => handleCourseClick(course.Course)}
                        />
                        <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(course.Course);
                            }}
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default CoursesList;