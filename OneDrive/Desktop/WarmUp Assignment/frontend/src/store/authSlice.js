import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Register User
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Login User
export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/login`, userData);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Change Password
export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL}/change-password`, passwordData, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Load User
export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        if (!token) return thunkAPI.rejectWithValue({ message: 'No token' });

        try {
            const response = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { user: response.data, token };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || 'Registration failed';
                state.user = null;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || 'Login failed';
                state.user = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isSuccess = true;
            })
            .addCase(loadUser.rejected, (state) => {
                state.user = null;
                state.token = null;
            });
    },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
