import { useState, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IeuLogo from "../../../assets/ieu-logo.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCourseClassroom } from '../../../store/courses';
import { ClassroomInterface } from '../../../store/classrooms';
import { CourseInterface } from '../../../store/courses';

export default function AppBarComponent() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const classrooms = useSelector((state: { classrooms: ClassroomInterface[] }) => state.classrooms);
    const allCourses = useSelector((state: { courses: CourseInterface[] }) => state.courses);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };
    
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    const availableClassrooms = classrooms.filter(room => {
        const hasEnoughCapacity = parseInt(room.Capacity) >= allCourses.reduce((max, course) => Math.max(max, course.Students.length), 0);
        const hasTimeConflict = allCourses.some(otherCourse => 
            otherCourse.Classroom === room.Classroom && 
            otherCourse.TimeToStart === allCourses[0].TimeToStart
        );
        return hasEnoughCapacity && !hasTimeConflict;
    });

    const handleDistributeClassrooms = () => {
        availableClassrooms.forEach((room, index) => {
            if (index < allCourses.length) {
                dispatch(updateCourseClassroom({
                    courseName: allCourses[index].Course,
                    classroom: room.Classroom
                }));
            }
        });
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <img 
                        src={IeuLogo} 
                        alt="IEU Timetable" 
                        width={40} 
                        className='me-3' 
                        onContextMenu={e => e.preventDefault()} 
                        draggable="false" 
                        onClick={handleLogoClick} 
                        style={{ cursor: 'pointer' }} 
                    />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        IEU.APP v2
                    </Typography>
                    <Button color="inherit" onClick={handleDistributeClassrooms}>Distribute</Button>
                    <Button color="inherit" onClick={handleImportClick} sx={{ ml: 2 }}>Import</Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </Toolbar>
            </AppBar>
            {selectedImage && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img src={selectedImage} alt="Imported" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                </Box>
            )}
        </Box>
    );
}