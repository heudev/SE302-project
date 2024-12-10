import { List, ListItem, ListItemText } from "@mui/material";
import { Collapse } from "@mui/material";

interface StudentsListProps {
    students: string[];
}

export function StudentsList({ students }: StudentsListProps) {
    return (
        <List sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 2, padding: 1, mt: 2 }}>
            {students.map((student, index) => (
                <Collapse key={index} in={true}>
                    <ListItem disablePadding>
                        <ListItemText primary={student} />
                    </ListItem>
                </Collapse>
            ))}
        </List>
    );
}
