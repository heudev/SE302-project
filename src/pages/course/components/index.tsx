import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, IconButton, Tabs, Tab, Divider } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import { CourseInfo } from "./courseInfo";
import { StudentsList } from "./studentsList";
import { WeeklyTable } from "./weeklyTable";
import { getAllItems } from "../../../database/tables/courses";
interface Course {
    Course: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Lecturer: string;
    Students: string[];
    Classroom?: string;
}

export default function CoursePage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getAllItems();
                setCourses(courses);
            } catch (error) {
                setError('Error loading courses');
                console.error(error);
            }
        };
        fetchCourses();
    }, []);

    if (error) {
        console.log(error);
        return <div>Error loading course: {error}</div>;
    }

    const course = courses.find((course) => course.Course === courseId);

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <Box sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>

                    <IconButton onClick={() => navigate("/")} sx={{ mb: 2 }}>
                        <ArrowBackIcon />
                        <Typography variant="button" sx={{ ml: 1 }}>
                            Back to Homepage
                        </Typography>
                    </IconButton>

                    <Typography variant="h3" gutterBottom>
                        {course.Course}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Instructor: {course.Lecturer}
                    </Typography>

                    <Divider sx={{ my: 2 }} />


                    <CourseInfo course={course} />

                    <Divider sx={{ my: 2 }} />


                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Tab label="Student List" />
                        <Tab label="Weekly Table" />
                    </Tabs>


                    {activeTab === 0 && <StudentsList students={course.Students} />}
                    {activeTab === 1 && <WeeklyTable />}
                </CardContent>
            </Card>
        </Box>
    );
}
