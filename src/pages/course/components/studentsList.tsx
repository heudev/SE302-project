import { List, ListItem, ListItemText, TextField, InputAdornment } from "@mui/material";
import { Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

interface StudentsListProps {
    students: string[];
}

export function StudentsList({ students }: StudentsListProps) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredStudents = students.filter(student => 
        student.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStudentClick = (studentName: string) => {
        navigate(`/student/${studentName}`);
    };

    return (
        <div>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ mt: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <List sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 2, padding: 1, mt: 2 }}>
                {filteredStudents.map((student, index) => (
                    <Collapse key={index} in={true}>
                        <ListItem 
                            disablePadding 
                            onClick={() => handleStudentClick(student)}
                            sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                                borderRadius: 1,
                                transition: 'background-color 0.2s'
                            }}
                        >
                            <ListItemText primary={student} />
                        </ListItem>
                    </Collapse>
                ))}
            </List>
        </div>
    );
}
