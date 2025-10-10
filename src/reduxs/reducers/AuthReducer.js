import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: true,
    token: '',
    _id: '',
    username: '',
    email: '',
    accountRole: ''
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: initialState
    },
    reducers: {
        addAuth: (state, action) => {
            const { user, token } = action.payload;
            state.data = {
                loading: false, 
                token,
                _id: user.id,
                username: user.username,
                email: user.email,
                accountRole: user.accountRole
            };
        },
        removeAuth: (state) => {
            state.data = { ...initialState, loading: false };
        }
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;
export const authSelector = (state) => state.authReducer.data;