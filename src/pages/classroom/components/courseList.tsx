import { ListItem, Collapse, TextField, InputAdornment, List, ListItemText } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CourseListProps {
    classroom: string;
    courses: string[];
}

export function CourseList({ courses }: CourseListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCourses = courses.filter(course => 
        course.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const navigate = useNavigate();

    const handleCourseClick = (courseName: string) => {
        navigate(`/coursePage/${courseName}`);
    };

    return (
        <div>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search courses..."
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
                {filteredCourses.length === 0 ? (
                    <ListItem>
                        <ListItemText primary="No courses found." sx={{ textAlign: 'center', color: 'text.secondary' }} />
                    </ListItem>
                ) : (
                    filteredCourses.map((course, index) => (
                        <Collapse key={index} in={true}>
                            <ListItem 
                                onClick={() => handleCourseClick(course)}
                                sx={{ 
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    },
                                    borderRadius: 1,
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <ListItemText primary={course} />
                            </ListItem>
                        </Collapse>
                    ))
                )}
            </List>
        </div>
    );
}
