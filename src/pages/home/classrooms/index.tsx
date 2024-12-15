import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import { Zoom } from "react-awesome-reveal";
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Chip } from "@mui/material";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

interface Classroom {
    Classroom: string;
    Capacity: string;
}

export default function Classrooms() {
    const navigate = useNavigate(); // Initialize the navigate hook
    const classrooms = useSelector((state: { classrooms: Classroom[] }) => state.classrooms);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClassrooms = classrooms.filter(classroom =>
        classroom.Classroom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle classroom click and navigate to the classroom details page
    const handleClassroomClick = (classroomName: string) => {
        navigate(`/classroom/${classroomName}`);  // Navigate to the classroom details page
    };

    return (
        <Zoom style={{ width: '100%', maxWidth: 380 }} delay={150} triggerOnce={true}>
            <Box sx={{ bgcolor: 'background.paper' }} className="shadow-2xl rounded">
                <TextField
                    type="search"
                    label={searchTerm === '' ? 'Search by Classroom Name' : 'Search results'}
                    variant="filled"
                    autoComplete="off"
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Divider />
                <List sx={{ overflowY: 'auto', height: 500 }}>
                    {filteredClassrooms.map((classroom, index) => (
                        <ListItem
                            key={`${classroom.Classroom}-${index}`}
                            disablePadding
                            className="shadow-md"
                        >
                            <ListItemButton
                                sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                                onClick={() => handleClassroomClick(classroom.Classroom)}  // Handle click
                            >
                                <ListItemText
                                    primary={classroom.Classroom}
                                />
                                <Chip
                                    icon={<MeetingRoomIcon />}
                                    label={`Capacity: ${classroom.Capacity}`}
                                    color="primary"
                                    variant="outlined"
                                    className="w-36"
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Zoom>
    );
}
