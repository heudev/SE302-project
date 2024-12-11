import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateIndexedDb } from '../middlewares/classroomsMiddleware';

export interface ClassroomInterface {
    Classroom: string;
    Capacity: string;
}

const initialState: ClassroomInterface[] = [];

const classroomsSlice = createSlice({
    name: 'classrooms',
    initialState,
    reducers: {
        setClassrooms(_, action: PayloadAction<ClassroomInterface[]>) {
            const newState = action.payload;
            updateIndexedDb(newState); // Update indexedDb
            return newState;
        },
    },
});

export const { setClassrooms } = classroomsSlice.actions;

export default classroomsSlice.reducer;