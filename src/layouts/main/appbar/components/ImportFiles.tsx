import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import { parseCsvData as parseCsvClassrooms } from '../../../../services/fetchClassrooms';
import { parseCsvData as parseCsvCourses } from '../../../../services/fetchCourses';
import { useDispatch } from 'react-redux';
import { setCourses } from "../../../../store/courses";
import { setClassrooms } from "../../../../store/classrooms";
import Alert from '@mui/material/Alert';
import Slide, { SlideProps } from '@mui/material/Slide';

export default function FileImport() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const fileContent = reader.result as string;

                try {
                    let parsedResult;
                    if (file.name === 'ClassroomCapacity.csv') {
                        parsedResult = parseCsvClassrooms(fileContent);
                        dispatch(setClassrooms(parsedResult));
                        setSnackbarMessage('Classroom data updated successfully!');
                    } else if (file.name === 'Courses.csv') {
                        parsedResult = parseCsvCourses(fileContent);
                        dispatch(setCourses(parsedResult));
                        setSnackbarMessage('Course data updated successfully!');
                    }
                    setSnackbarOpen(true);
                    console.log(`Parsed ${file.name} data:`, parsedResult);
                } catch (error) {
                    console.error(`Error parsing the ${file.name}:`, error);
                }
            };

            reader.onerror = () => {
                console.error('Error reading the file.');
            };

            reader.readAsText(file);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const SlideTransition = (props: SlideProps) => {
        return <Slide {...props} direction="left" />;
    };

    return (
        <div>
            <Tooltip title="Please select either 'ClassroomCapacity.csv' for classroom data or 'Courses.csv' for course data. The relevant database will be updated.">
                <Button
                    color="warning"
                    variant="contained"
                    onClick={() => fileInputRef.current?.click()}
                    className='w-32'
                >
                    Import
                </Button>
            </Tooltip>

            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileSelection}
                style={{ display: 'none' }}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                TransitionComponent={SlideTransition}
                sx={{ mt: 7 }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}