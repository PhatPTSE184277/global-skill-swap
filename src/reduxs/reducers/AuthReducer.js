import { createSlice } from '@reduxjs/toolkit';

const localDataNames = {
    authData: 'authData'
};

const initialState = {
    token: '',
    username: '',
    email: ''
};


const getInitialAuth = () => {
    let data = {};
    try {
        data = JSON.parse(localStorage.getItem(localDataNames.authData)) || {};
    } catch {
        data = {};
    }
    return {
        token: data.token || '',
        username: data.username || '',
        email: data.email || ''
    };
};

const syncLocal = (data) => {
    localStorage.setItem(localDataNames.authData, JSON.stringify(data));
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: getInitialAuth()
    },
    reducers: {
        addAuth: (state, action) => {
            const { user, token } = action.payload;
            const payload = {
                token: token,
                _id: user.id,
                username: user.username,
                email: user.email
            };
            state.data = payload;
            syncLocal(payload);
        },
        removeAuth: (state) => {
            state.data = initialState;
            localStorage.removeItem(localDataNames.authData);
        }
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;
export const authSelector = (state) => state.authReducer.data;