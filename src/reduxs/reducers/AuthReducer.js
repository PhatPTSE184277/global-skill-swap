import { createSlice } from '@reduxjs/toolkit';

const localDataNames = {
    authData: 'authData'
};

const initialState = {
    token: '',
    _id: '',
    name: '',
    rule: 0
};

const syncLocal = (data) => {
    localStorage.setItem(localDataNames.authData, JSON.stringify(data));
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: initialState
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload;
            syncLocal(action.payload);
        },
        removeAuth: (state) => {
            state.data = initialState;
            syncLocal({});
        }
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;
export const authSelector = (state) => state.authReducer.data;