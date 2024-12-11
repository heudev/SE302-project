import { ListItem, Collapse } from "@mui/material";

interface CourseListProps {
    classroom: string;
    courses: string[];  // List of courses in the classroom
}

export function CourseList({ courses }: CourseListProps) {
    return (
        <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-lg p-2 mt-2">
            {courses.length === 0 ? (
                <div className="py-4 px-6 text-lg text-center text-gray-500">No courses available in this classroom.</div>
            ) : (
                courses.map((course, index) => (
                    <Collapse key={index} in={true}>
                        <ListItem className="p-0">
                            <div className="py-2 px-4 text-lg">{course}</div>
                        </ListItem>
                    </Collapse>
                ))
            )}
        </div>
    );
}
