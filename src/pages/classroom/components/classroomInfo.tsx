import { Chip } from "@mui/material";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';

interface ClassroomProps {
    Classroom: string;
    Capacity: string;
}

export function ClassroomInfo({ classroom }: { classroom: ClassroomProps }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Classroom Name */}
            <div className="w-full">
                <Chip
                    icon={<MeetingRoomIcon />}
                    label={`Classroom: ${classroom.Classroom}`}
                    color="primary"
                    className="w-full"
                    variant="outlined"
                />
            </div>

            {/* Capacity */}
            <div className="w-full">
                <Chip
                    icon={<GroupIcon />}
                    label={`Capacity: ${classroom.Capacity}`}
                    color="secondary"
                    className="w-full"
                    variant="outlined"
                />
            </div>
        </div>
    );
}
