import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "../../../hooks/useCourses";
import { Box, Typography, Card, CardContent, IconButton, Tabs, Tab, Divider } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import { CourseInfo } from "./courseInfo";
import { StudentsList } from "./studentsList";
import { WeeklyTable } from "./weeklyTable";

export default function CoursePage() {
    const { courseId } = useParams(); 
    const navigate = useNavigate(); 
    const { courses, error } = useCourses();
    const [activeTab, setActiveTab] = useState(0); 

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
                        onChange={(event, newValue) => setActiveTab(newValue)}
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
