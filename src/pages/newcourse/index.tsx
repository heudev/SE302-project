import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCourses, CourseInterface } from "../../store/courses";
import { ClassroomInterface } from "../../store/classrooms";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography, List, ListItem, ListItemText, IconButton, SelectChangeEvent, OutlinedInput, Checkbox, Snackbar, Stack, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { FixedSizeList as VirtualizedList } from 'react-window';
import { useNavigate } from 'react-router-dom';

export default function NewCourse() {
    const dispatch = useDispatch();
    const courses = useSelector((state: { courses: CourseInterface[] }) => state.courses);
    const classrooms = useSelector((state: { classrooms: ClassroomInterface[] }) => state.classrooms);

    const [course, setCourse] = useState<CourseInterface>({
        Course: '',
        TimeToStart: '',
        DurationInLectureHours: '',
        Lecturer: '',
        Classroom: '',
        Students: []
    });

    const hours = [
        "08:30",
        "09:25",
        "10:20",
        "11:15",
        "12:10",
        "13:05",
        "14:00",
        "14:55",
        "15:50",
        "16:45",
        "17:40",
        "18:35",
        "19:30",
    ];
    const days = {
        "Monday": hours,
        "Tuesday": hours,
        "Wednesday": hours,
        "Thursday": hours,
        "Friday": hours,
        "Saturday": hours,
        "Sunday": hours
    };

    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setCourse({ ...course, Classroom: e.target.value as string });
    };

    const handleStudentSelectChange = (e: SelectChangeEvent<string[]>) => {
        const value = e.target.value;
        setSelectedStudents(typeof value === 'string' ? value.split(',') : value);
    };

    const handleAddStudents = () => {
        const uniqueStudents = Array.from(new Set(selectedStudents));
        setCourse({ ...course, Students: uniqueStudents });
    };

    const handleRemoveStudent = (student: string) => {
        setCourse({ ...course, Students: course.Students.filter(s => s !== student) });
    };

    const handleSaveCourse = () => {
        dispatch(setCourses([...courses, course]));
        // Add course to the classroom's course list and students' course list
        // ...additional logic...
        setOpenSnackbar(true);
        setTimeout(() => {
            navigate('/');
        }, 2000); // Redirect after 2 seconds
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const getAvailableTimes = () => {
        const availableTimes: string[] = [];

        Object.entries(days).forEach(([day, times]) => {
            times.forEach(time => {
                const timeSlot = `${day} ${time}`;

                // Check if any selected student has a course at this time
                const isTimeAvailable = selectedStudents.every(student => {
                    return !courses.some(existingCourse => {
                        if (existingCourse.Students.includes(student)) {
                            // Get the time range of the existing course
                            const [courseDay, courseStartTime] = existingCourse.TimeToStart.split(' ');
                            const courseStartIndex = hours.indexOf(courseStartTime);
                            const courseEndIndex = courseStartIndex + parseInt(existingCourse.DurationInLectureHours);

                            // Check if the current time slot falls within the course duration
                            if (courseDay === day) {
                                const currentTimeIndex = hours.indexOf(time)
                                return currentTimeIndex >= courseStartIndex && currentTimeIndex < courseEndIndex;
                            }
                        }
                        return false;
                    });
                });

                if (isTimeAvailable) {
                    availableTimes.push(timeSlot);
                }
            });
        });

        return availableTimes;
    };

    const getAvailableClassrooms = () => {
        if (!course.TimeToStart || !course.DurationInLectureHours) return [];

        const [day, startTime] = course.TimeToStart.split(' ');
        const startHourIndex = hours.indexOf(startTime);
        const duration = parseInt(course.DurationInLectureHours);
        const endHourIndex = startHourIndex + duration;

        if (endHourIndex > hours.length) return [];

        const occupiedClassrooms = new Set<string>();
        courses.forEach(course => {
            const [courseDay, courseStartTime] = course.TimeToStart.split(' ');
            const courseStartHourIndex = hours.indexOf(courseStartTime);
            const courseDuration = parseInt(course.DurationInLectureHours);
            const courseEndHourIndex = courseStartHourIndex + courseDuration;

            if (courseDay === day && (
                (startHourIndex >= courseStartHourIndex && startHourIndex < courseEndHourIndex) ||
                (endHourIndex > courseStartHourIndex && endHourIndex <= courseEndHourIndex)
            )) {
                occupiedClassrooms.add(course.Classroom);
            }
        });

        return classrooms.filter(classroom => {
            const isClassroomAvailable = !occupiedClassrooms.has(classroom.Classroom);
            const isCapacitySufficient = parseInt(classroom.Capacity) >= selectedStudents.length;
            return isClassroomAvailable && isCapacitySufficient;
        });
    };

    const getAvailableDurations = () => {
        if (!course.TimeToStart) return [];

        const [day, startTime] = course.TimeToStart.split(' ');
        const startHourIndex = hours.indexOf(startTime);

        let maxDuration = 1;
        for (let i = startHourIndex + 1; i < hours.length; i++) {
            const timeSlot = `${day} ${hours[i]}`;
            const isAvailable = selectedStudents.every(student => {
                return !courses.some(course => course.Students.includes(student) && course.TimeToStart === timeSlot);
            });
            if (!isAvailable) break;
            maxDuration++;
        }

        return Array.from({ length: Math.min(maxDuration, 5) }, (_, i) => (i + 1).toString());
    };

    const getFilteredStudents = () => {
        const allStudents = Array.from(new Set(courses.flatMap(course => course.Students)));
        return allStudents.filter(student =>
            student.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const renderStudent = ({ index, style }: { index: number, style: React.CSSProperties }) => {
        const filteredStudents = getFilteredStudents();
        const student = filteredStudents[index];
        if (!student) return null;

        const isSelected = selectedStudents.indexOf(student) > -1;

        const handleClick = () => {
            const newSelectedStudents = isSelected
                ? selectedStudents.filter(s => s !== student)
                : [...selectedStudents, student];
            setSelectedStudents(newSelectedStudents);
        };

        return (
            <MenuItem key={student} value={student} style={style} onClick={handleClick} dense={true} disableRipple>
                <Checkbox checked={isSelected} />
                <ListItemText primary={student} />
            </MenuItem>
        );
    };
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

                    <Typography variant="h4" gutterBottom color='primary'>New Course</Typography>
                    <TextField
                        label="Course Code"
                        name="Course"
                        value={course.Course}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Instructor"
                        name="Lecturer"
                        value={course.Lecturer}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Students</InputLabel>
                        <Select
                            multiple
                            value={selectedStudents}
                            onChange={handleStudentSelectChange}
                            input={<OutlinedInput label="Students" />}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            <Box sx={{ p: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </Box>
                            <VirtualizedList
                                height={400}
                                width="100%"
                                itemSize={46}
                                itemCount={getFilteredStudents().length}
                            >
                                {renderStudent}
                            </VirtualizedList>
                        </Select>
                    </FormControl>
                    <Button onClick={handleAddStudents} variant="contained" fullWidth >Add Students</Button>
                    <List>
                        {course.Students.map((student) => (
                            <ListItem key={`${course.Course}-${student}`} secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveStudent(student)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText primary={student} />
                            </ListItem>
                        ))}
                    </List>
                    <FormControl fullWidth margin="normal" disabled={selectedStudents.length === 0}>
                        <InputLabel>Time to Start</InputLabel>
                        <Select
                            value={course.TimeToStart}
                            onChange={(e) => setCourse({ ...course, TimeToStart: e.target.value as string })}
                        >
                            {getAvailableTimes().map((time) => (
                                <MenuItem key={time} value={time}>
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" disabled={!course.TimeToStart}>
                        <InputLabel>Duration (Lecture Hours)</InputLabel>
                        <Select
                            value={course.DurationInLectureHours}
                            onChange={(e) => setCourse({ ...course, DurationInLectureHours: e.target.value as string })}
                        >
                            {getAvailableDurations().map((duration) => (
                                <MenuItem key={duration} value={duration}>
                                    {duration}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" disabled={!course.DurationInLectureHours}>
                        <InputLabel>Classroom</InputLabel>
                        <Select
                            value={course.Classroom}
                            onChange={handleSelectChange}
                        >
                            {getAvailableClassrooms().map((classroom) => (
                                <MenuItem key={classroom.Classroom} value={classroom.Classroom}>
                                    {classroom.Classroom} (Capacity: {classroom.Capacity})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button onClick={handleSaveCourse} variant="contained" color="primary" sx={{ mt: 3 }}
                        disabled={!course.Course || !course.Lecturer || !course.DurationInLectureHours || !course.TimeToStart || !course.Classroom || course.Students.length === 0}
                    >Save Course</Button>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={2000}
                        onClose={handleCloseSnackbar}
                        message="Course saved successfully"
                    />
                </CardContent>
            </Card>
        </Box>
    );
}


/*
  courses state should be like this:
  [{
  "Course": "CE215",
  "TimeToStart": "Monday 11:15",
  "DurationInLectureHours": "3",
  "Lecturer": "Kaya Oğuz",
  "Classroom": "M103",
  "Students": [
      "ALİ MERT KİRACIOĞLU",
      "ALİ EMİR AYDIN",
      "ALİ MUZAFFER KORAY CENGİZ",
      "ALİ BERKE IŞIK",
      "ALİ NESİBE NUR PEKÇAKAR",
      "ALİ HİLAL SİNEM SAYAR",
      "ALİ HÜSEYİN EGE AKIN",
      "ALİ BERAT BORA ALTAŞ",
      "ALİ KADİR AY",
      "ALİ DOĞA GÜNEŞ",
      "ALİ MERT KOĞUŞ",
      "ALİ ALEYNA KÖK",
      "ALİ ELİF SUDE ÖZMEN",
      "ALİ BETÜL ÖZSAN",
      "ALİ ESER POYRAZ",
      "ALİ ARDA SARI",
      "ALİ EGE SEVİNDİ",
      "ALİ ÖZCAN BURAK ŞANLILAR",
      "ALİ BEKİR CAN TÜRKMEN",
      "ALİ İPEK SUDE YAVAŞ",
      "ALİ EBRU BURHAN",
      "ALİ HULKİ ENES UYSAL",
      "ALİ EGE ÇAKICI",
      "ALİ OSMAN SERHAN AYDOĞAN",
      "ALİ HÜSEYİN EREN CEYHAN",
      "ALİ BETÜL SİNEM ÇETİNER",
      "ALİ MELTEM DEMİR",
      "ALİ TUNA DEMİRCİ",
      "ALİ EMİRAY DURMAZ",
      "ALİ ARAS FIRAT",
      "ALİ HASAN BERK GÖRGÜLÜ",
      "ALİ MAHMUT ÖZGÜR KIZIL",
      "ALİ EDİZ ARKIN KOBAK",
      "ALİ ALP KOÇAK",
      "ALİ YASEMİN GÜLER KOÇAR",
      "ALİ BENHUR RAHMAN OKUR",
      "ALİ ORKUN EFE ÖZDEMİR",
      "ALİ SELEN ÖZNUR",
      "ALİ MEHMET AKIN SAVAŞÇI",
      "ALİ EFE SÖNMEZ",
      "ALİ TUNAY KOLUAÇIK",
      "ALİ EREN TOPÇU",
      "ALİ İLAYDA BUZBUZ",
      "ALİ FİLİZNUR DEMİR",
      "ALİ TARIK ALİ DİNÇEL",
      "ALİ DOĞA ORHAN",
      "ALİ MURAT EMİR SELVİ",
      "ALİ EFE SERİN",
      "ALİ CENKER EFE TAHAN",
      "ALİ BURAK CAN YILMAZ",
      "ALİ EGE YILMAZ",
      "ALİ MATTHEW OZAN EANES",
      "ALİ DEMİR CÜCÜ",
      "ALİ MELİH ALPEREN KABUKÇU",
      "ALİ ŞERİFE ŞEVVAL KOÇ",
      "ALİ İDİL TOPRAKKALE",
      "ALİ BEYAZIT TUR",
      "ALİ YUNUS EMRE YALÇINKAYA",
      "ALİ EGE ORHAN",
      "ALİ YASAMAN HAGHSHENAS",
      "ALİ SUDE TESLİME DAKA"
  ]
},
{
  "Course": "CE315",
  "TimeToStart": "Wednesday 9:25",
  "DurationInLectureHours": "5",
  "Lecturer": "Alper Demir",
  "Classroom": "M103",
  "Students": [
      "VELİ MERT KİRACIOĞLU",
      "VELİ EMİR AYDIN",
      "VELİ MUZAFFER KORAY CENGİZ",
      "VELİ BERKE IŞIK",
      "VELİ NESİBE NUR PEKÇAKAR",
      "VELİ HİLAL SİNEM SAYAR",
      "VELİ HÜSEYİN EGE AKIN",
      "VELİ BERAT BORA ALTAŞ",
      "VELİ KADİR AY",
      "VELİ DOĞA GÜNEŞ",
      "VELİ MERT KOĞUŞ",
      "VELİ ALEYNA KÖK",
      "VELİ ELİF SUDE ÖZMEN",
      "VELİ BETÜL ÖZSAN",
      "VELİ ESER POYRAZ",
      "VELİ ARDA SARI",
      "VELİ EGE SEVİNDİ",
      "VELİ ÖZCAN BURAK ŞANLILAR",
      "VELİ BEKİR CAN TÜRKMEN",
      "VELİ İPEK SUDE YAVAŞ",
      "VELİ EBRU BURHAN",
      "VELİ HULKİ ENES UYSAL",
      "VELİ EGE ÇAKICI",
      "VELİ OSMAN SERHAN AYDOĞAN",
      "VELİ HÜSEYİN EREN CEYHAN",
      "VELİ BETÜL SİNEM ÇETİNER",
      "VELİ MELTEM DEMİR",
      "VELİ TUNA DEMİRCİ",
      "VELİ EMİRAY DURMAZ",
      "VELİ ARAS FIRAT",
      "VELİ HASAN BERK GÖRGÜLÜ",
      "VELİ MAHMUT ÖZGÜR KIZIL",
      "VELİ EDİZ ARKIN KOBAK",
      "VELİ ALP KOÇAK",
      "VELİ YASEMİN GÜLER KOÇAR",
      "VELİ BENHUR RAHMAN OKUR",
      "VELİ ORKUN EFE ÖZDEMİR",
      "VELİ SELEN ÖZNUR",
      "VELİ MEHMET AKIN SAVAŞÇI",
      "VELİ EFE SÖNMEZ",
      "VELİ TUNAY KOLUAÇIK",
      "VELİ EREN TOPÇU",
      "VELİ İLAYDA BUZBUZ",
      "VELİ FİLİZNUR DEMİR",
      "VELİ TARIK ALİ DİNÇEL",
      "VELİ DOĞA ORHAN",
      "VELİ MURAT EMİR SELVİ",
      "VELİ EFE SERİN",
      "VELİ CENKER EFE TAHAN",
      "VELİ BURAK CAN YILMAZ",
      "VELİ EGE YILMAZ",
      "VELİ MATTHEW OZAN EANES",
      "VELİ DEMİR CÜCÜ",
      "VELİ MELİH ALPEREN KABUKÇU",
      "VELİ ŞERİFE ŞEVVAL KOÇ",
      "VELİ İDİL TOPRAKKALE",
      "VELİ BEYAZIT TUR",
      "VELİ YUNUS EMRE YALÇINKAYA",
      "VELİ EGE ORHAN",
      "VELİ YASAMAN HAGHSHENAS",
      "VELİ SUDE TESLİME DAKA"
  ]
}]
  */


/*
classrooms state should be like this:
[{
    "Classroom": "C201",
    "Capacity": "35"
},
{
    "Classroom": "C203",
    "Capacity": "40"
}]
*/