import { useClassrooms } from "../../../hooks/useClassrooms";

export default function Classrooms() {
    const { classrooms, error } = useClassrooms();

    if (error) {
        console.log(error);
        return <div>Error loading classrooms: {error}</div>;
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
