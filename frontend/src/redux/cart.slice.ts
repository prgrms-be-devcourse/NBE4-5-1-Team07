import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
    id: string;
    name: string;
    quantity: number;
}

const initialState: CartItem[] = [];

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.find(item => item.id === action.payload.id);
            existingItem
                ? existingItem.quantity += action.payload.quantity
                : state.push(action.payload);
        }
    }
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;