import { Box, List, ListItem, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { CourseInterface } from '../../../store/courses';

interface CoursesListProps {
    name: string;
}

const CoursesList = ({ name }: CoursesListProps) => {
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    const studentCourses = courses.filter(course => course.Students.includes(name));

    return (
        <Box>
            <List>
                {studentCourses.map((course,index) => (
                    <ListItem key={index}>
                        <ListItemText primary={course.Course} secondary={course.Lecturer} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default CoursesList;
