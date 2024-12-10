import { useEffect, useState } from "react";
import { Zoom } from "react-awesome-reveal";
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Chip } from "@mui/material";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { getAllItems as getAllItems } from "../../../database/tables/classrooms";

interface Classroom {
    Classroom: string;
    Capacity: string;
}

export default function Classrooms() {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllItems();
                console.log("dataaa", data);
                setClassrooms(data);
            } catch (err) {
                setError('Error loading courses');
                console.error(err);
            }
        };

        const timer = setTimeout(() => {
            fetchCourses();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (error) {
        console.log(error);
        return <div>Error loading classrooms: {error}</div>;
    }

    console.log("asdasd", classrooms);

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
                    {filteredClassrooms.map((classroom, index) => (
                        <ListItem
                            key={`${classroom.Classroom}-${index}`} // Ensure unique key
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
