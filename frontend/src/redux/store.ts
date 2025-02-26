'use client';

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart.slice';
import authReducer from "./auth.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;