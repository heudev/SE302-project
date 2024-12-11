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
    },
});

export const { setCourses } = coursesSlice.actions;

export default coursesSlice.reducer;