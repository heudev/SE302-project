import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, IconButton, Tabs, Tab, Divider, Stack } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useState } from "react";
import { useSelector } from "react-redux";
import { CourseInfo } from "./courseInfo";
import { StudentsList } from "./studentsList";
import { WeeklyTable } from "./weeklyTable";
import { CourseInterface } from "../../../store/courses";

export default function CoursePage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);

    const [activeTab, setActiveTab] = useState(0);

    const course = courses.find((course) => course.Course === courseId);

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
                        {course?.Course}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Instructor: {course?.Lecturer}
                    </Typography>

                    <Divider sx={{ my: 2 }} />


                    {course && <CourseInfo course={course} />}

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


                    {activeTab === 0 && <StudentsList students={course?.Students || []} />}
                    {activeTab === 1 && <WeeklyTable />}
                </CardContent>
            </Card>
        </Box>
    );
}
