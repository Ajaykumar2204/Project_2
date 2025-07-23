import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const MenuSlice = createSlice({
  name: 'Menu',
  initialState,
  reducers: {
    addMenu: (state, action) => {
      state.items = action.payload;
    },
    updateMenuItem: (state, action) => {
      const updated = action.payload;
      const index = state.items.findIndex(item => item._id === updated._id);
      if (index !== -1) {
        state.items[index] = updated;
      }
    },
    deleteMenuItem: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    removeMenu: (state) => {
      state.items = [];
    },
  },
});

export const { addMenu, updateMenuItem, deleteMenuItem, removeMenu } = MenuSlice.actions;
export default MenuSlice.reducer;
