import { Grid, Chip } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClassroomIcon from '@mui/icons-material/Class';
import GroupIcon from '@mui/icons-material/Group';

interface CourseInfoProps {
    course: any; 
}

export function CourseInfo({ course }: CourseInfoProps) {
    return (
        <Grid container spacing={2}>
            
            <Grid item xs={12} sm={6}>
                <Chip
                    icon={<AccessTimeIcon />}
                    label={`Start Time: ${course.TimeToStart}`}
                    color="primary"
                    sx={{ width: '100%' }}
                    variant="outlined"
                />
            </Grid>

            
            <Grid item xs={12} sm={6}>
                <Chip
                    label={`Duration: ${course.DurationInLectureHours} hrs`}
                    color="secondary"
                    sx={{ width: '100%' }}
                    variant="outlined"
                />
            </Grid>

            
            {course.Classroom && (
                <Grid item xs={12} sm={6}>
                    <Chip
                        icon={<ClassroomIcon />}
                        label={`Classroom: ${course.Classroom}`}
                        color="default"
                        sx={{ width: '100%' }}
                        variant="outlined"
                    />
                </Grid>
            )}

            
            <Grid item xs={12} sm={6}>
                <Chip
                    icon={<GroupIcon />}
                    label={`Students: ${course.Students.length}`}
                    color="success"
                    sx={{ width: '100%' }}
                    variant="outlined"
                />
            </Grid>
        </Grid>
    );
}
