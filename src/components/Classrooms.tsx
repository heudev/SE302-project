import { useClassrooms } from "../hooks/useClassrooms";

export default function Classroom() {
    const { classrooms, error } = useClassrooms();

    if (error) {
        return <div>Error loading classrooms: {error.message}</div>;
    }

    console.log(classrooms);

    return (
        <div>
            {classrooms.map((classroom) => (
                <div>
                    <h3>{classroom.Classroom}</h3>
                    <p>Capacity: {classroom.Capacity}</p>
                </div>
            ))}
        </div>
    );
}