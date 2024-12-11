import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Divider, IconButton, Tabs, Tab } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from "react-redux";
import { useState } from "react";
import { ClassroomInterface } from "../../../store/classrooms";
import { CourseInterface } from "../../../store/courses";
import { CourseList } from "./courseList";  // Import the CourseList component
import { ClassroomInfo } from "./classroomInfo";  // Add this import

export default function ClassroomPage() {
    const { classroomId } = useParams();  // Get the classroomId from the URL
    const navigate = useNavigate();
    const classrooms = useSelector((state: { classrooms: ClassroomInterface[] }) => state.classrooms);  // Fetch classroom data
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    const classroom = classrooms.find((classroom) => classroom.Classroom === classroomId); // Find classroom by name

    const [activeTab, setActiveTab] = useState(0);

    // Filter courses for the specific classroom
    const classroomCourses = courses.filter(course => course.Classroom === classroomId);

    // Navigate back to the homepage
    const handleBack = () => {
        navigate("/");  // Navigate to the homepage
    };

    return (
        <Box sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    {/* Back to Homepage Button */}
                    <IconButton onClick={handleBack} sx={{ mb: 2 }}>
                        <ArrowBackIcon />
                        <Typography variant="button" sx={{ ml: 1 }}>
                            Back to Homepage
                        </Typography>
                    </IconButton>

                    <Typography variant="h3" gutterBottom>
                        {classroom?.Classroom}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Classroom Details
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {classroom && <ClassroomInfo classroom={classroom} />}

                    <Divider sx={{ my: 2 }} />

                    {/* Tabs */}
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

                    {/* Tab Content */}
                    {activeTab === 0 && (
                        <Box sx={{ padding: 2 }}>
                            <CourseList classroom={classroom?.Classroom || ''} courses={classroomCourses.map(course => course.Course)} />
                        </Box>
                    )}
                    {activeTab === 1 && (
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="h6">Weekly Table content will be here</Typography>
                            {/* Render the weekly table content here */}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
