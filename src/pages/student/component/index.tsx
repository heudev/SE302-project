import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, IconButton, Tabs, Tab, Divider, Stack } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useState } from "react";
import { useSelector } from "react-redux";
import StudentInfo from "./studentInfo";
import CoursesList from "./coursesList";
import { WeeklyTable } from "../../../components/weeklyTable";
import { CourseInterface } from "../../../store/courses";

export default function StudentPage() {
    const { studentName } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    const selectedCourses = courses.filter(course => course.Students.includes(studentName as string));
    return (
        <Box sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                        <IconButton onClick={() => navigate("/")}>
                            <HomeIcon />
                        </IconButton>
                    </Stack>

                    <Typography variant="h3" gutterBottom>
                        {studentName}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Student Details
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {<StudentInfo name={studentName as string} />}

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
                        <Tab label="Course List" />
                        <Tab label="Weekly Table" />
                    </Tabs>

                    {activeTab === 0 && <CoursesList name={studentName as string} />}
                    {activeTab === 1 && <WeeklyTable selectedCourses={selectedCourses} />}
                </CardContent>
            </Card>
        </Box>
    );
}
