import { useClassrooms } from "../../../hooks/useClassrooms";
import { Zoom } from "react-awesome-reveal";
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Chip } from "@mui/material";
import { useState } from "react";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

export default function Classrooms() {
    const { classrooms, error } = useClassrooms();
    const [searchTerm, setSearchTerm] = useState('');

    if (error) {
        console.log(error);
        return <div>Error loading classrooms: {error}</div>;
    }

    console.log(classrooms);

    // Filter
    const filteredClassrooms = classrooms.filter(classroom =>
        classroom.Classroom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Zoom style={{ width: '100%', maxWidth: 380 }} delay={700} triggerOnce={true}>
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
                    {filteredClassrooms.map((classroom) => (
                        <ListItem
                            key={classroom.Classroom}
                            disablePadding
                            className="shadow-md"
                        >
                            <ListItemButton sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                
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
