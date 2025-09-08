import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // { productId, quantity, product }
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.product._id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId: product._id, quantity, product });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.productId === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.productId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer; 