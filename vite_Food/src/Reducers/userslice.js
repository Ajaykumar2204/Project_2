import { createSlice } from "@reduxjs/toolkit";

const userslice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    loginuser: (state, action) => action.payload,
    removeloginuser: () => null,
  },
});

export const { loginuser, removeloginuser } = userslice.actions;
export default userslice.reducer;