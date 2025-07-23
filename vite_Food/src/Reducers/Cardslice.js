// src/reducers/CardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // ✅ Use plural
  customerInfo: {
    name: '',
    phone: '',
    tableNumber: '',
    Note: '',
  },
};

const CardSlice = createSlice({
  name: 'Card',
  initialState,
  reducers: {
    addcard: (state, action) => {
      const item = action.payload;
      const exist = state.items.find(i => i._id === item._id);
      if (exist) {
        exist.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },

    removecard: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },

    decrement: (state, action) => {
      const id = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    clearcard: (state) => {
      state.items = [];
      state.customerInfo = {
        name: '',
        phone: '',
        tableNumber: '',
        Note: '',
      };
    },

    updateCustomerInfo: (state, action) => {
      state.customerInfo = {
        ...state.customerInfo,
        ...action.payload,
      };
    },
  },
});

export const {
  addcard,
  removecard,
  clearcard,
  decrement,
  updateCustomerInfo,
} = CardSlice.actions;

export default CardSlice.reducer;