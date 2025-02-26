import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isLoggedIn: boolean;
    isAdmin: boolean;
    username?: string;
}

const initialState: AuthState = {
    isLoggedIn: false,
    isAdmin: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (
            state,
            action: PayloadAction<{ username: string; isAdmin: boolean }>
        ) => {
            state.isLoggedIn = true;
            state.username = action.payload.username;
            state.isAdmin = action.payload.isAdmin;
        },
        logoutSuccess: (state) => {
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.username = undefined;
        },
    },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;