import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const UserMenuSlice = createSlice({
  name: 'UserMenu',
  initialState,
  reducers: {
    addToUserMenu: (state, action) => {
      state.items = action.payload;
    },
    removeToUserMenu: (state) => {
      state.items = [];
    },
  },
});

export const { addToUserMenu, removeToUserMenu } = UserMenuSlice.actions;
export default UserMenuSlice.reducer;