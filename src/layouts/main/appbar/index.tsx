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

    //(availableClasroomları çekemedim course page den tekrardan yapıyor düzeltilebilir )
    //sıralamayı doğru yapıyor ama available da karışık gözüküyor
    //mutlak fark eşitse ilkini alıyor hep
    //öğrenci eklenince ya da çıkarılınca olan çakışmalara bakılması lazım 
    //handle yapınca olana da bakılcak 
    const getAvailableClassrooms = (course: CourseInterface) => {
        return classrooms
            .filter(room => {
                const hasEnoughCapacity = parseInt(room.Capacity) >= course.Students.length;

                const hasTimeConflict = allCourses.some(otherCourse => 
                    otherCourse.Course !== course.Course && // Don't check against self
                    otherCourse.Classroom === room.Classroom && // Same classroom
                    otherCourse.TimeToStart === course.TimeToStart // Same time
                );

                return hasEnoughCapacity && !hasTimeConflict;
            })
            .sort((a, b) => {
                
                const capacityA = parseInt(a.Capacity);
                const capacityB = parseInt(b.Capacity);
                const enrollment = course.Students.length;
                const diffA = Math.abs(capacityA - enrollment);
                const diffB = Math.abs(capacityB - enrollment);
            
                // Öncelik mutlak farkta
                if (diffA !== diffB) {
                    return diffA - diffB;
                }
            
                // Eğer mutlak fark eşitse, kapasiteye göre artan sırala
                return capacityA - capacityB;
            })
    };

    const handleDistributeClassrooms = () => {
        allCourses.forEach((course) => {
            const availableClassrooms = getAvailableClassrooms(course);
            if (availableClassrooms.length > 0) {
                dispatch(updateCourseClassroom({
                    courseName: course.Course,
                    classroom: availableClassrooms[0].Classroom // Assign the most suitable classroom
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