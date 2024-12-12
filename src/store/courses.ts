import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateIndexedDb } from '../middlewares/coursesMiddleware';

export interface CourseInterface {
    Course: string;
    TimeToStart: string;
    DurationInLectureHours: string;
    Lecturer: string;
    Students: string[];
    Classroom: string;
}

const initialState: CourseInterface[] = [];

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setCourses(_, action: PayloadAction<CourseInterface[]>) {
            const newState = action.payload;
            updateIndexedDb(newState); // Update indexedDb
            return newState;
        },
        updateCourseClassroom(state, action: PayloadAction<{ courseName: string, classroom: string }>) {
            const newState = state.map(course => 
                course.Course === action.payload.courseName 
                    ? { ...course, Classroom: action.payload.classroom }
                    : course
            );
            updateIndexedDb(newState);
            return newState;
        }
    },
});

export const { setCourses, updateCourseClassroom } = coursesSlice.actions;

export default coursesSlice.reducer;