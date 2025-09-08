import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'allProducts',
    initialState: {
        allProducts:[],
    },
    reducers: {
        setAllProducts(state, action) {
            return {
                ...state,
                allProducts: action.payload.data
            }
        },
    }
});


export const { setAllProducts } = productSlice.actions;
export default productSlice.reducer;