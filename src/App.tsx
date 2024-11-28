import { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface Course {
  Course: string,
  TimeToStart: string,
  DurationInLectureHours: string,
  Lecturer: string,
  Students: string[]
}

interface Classroom {
  Classroom: string,
  Capacity: string
}

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    window.ipcRenderer.invoke('read-courses-file').then((fileContent: string) => {
      Papa.parse(fileContent, {
        header: true,
        delimiter: ";",
        transform: (value) => value.trim(),
        complete: (results) => {
          const processedData = (results.data as Record<string, string>[]).map((row: Record<string, string>) => {
            const courseData: Course = {
              Course: row.Course,
              TimeToStart: row.TimeToStart,
              DurationInLectureHours: row.DurationInLectureHours,
              Lecturer: row.Lecturer,
              Students: Object.values(row)
                .slice(4)
                .filter(value => value !== "")
                .map(value => value as string)
            };
            return courseData;
          });
          setCourses(processedData);
        },
      });
    });

    window.ipcRenderer.invoke('read-classrooms-file').then((fileContent: string) => {
      Papa.parse(fileContent, {
        header: true,
        complete: (results: Papa.ParseResult<Classroom>) => {
          setClassrooms(results.data);
        },
      });
    });
  }, []);

  console.log(courses);
  console.log(classrooms);

  return (
    <div className="bg-sky-500 font-bold text-2xl flex justify-around">
      <div className='mx-auto'>
        <div className='text-black mb-5'>COURSES</div>
        {courses.length > 0 ? (
          <ul>
            {courses.map((course: Course, index: number) => (
              <li key={index}>{course.Course}</li>
            ))}
          </ul>
        ) : (
          <p>No courses available</p>
        )}
      </div>

      <div className='mx-auto'>
        <div className='text-black mb-5'>CLASSROOM</div>
        {classrooms.length > 0 ? (
          <ul>
            {classrooms.map((classroom: Classroom, index: number) => (
              <li key={index}>{classroom.Classroom}: {classroom.Capacity}</li>
            ))}
          </ul>
        ) : (
          <p>No classrooms available</p>
        )}
      </div>
    </div>
  );
}

export default App;