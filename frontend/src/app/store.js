import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookReducer from "../features/bookSlice";
import shelfReducer from "../features/shelfSlice";
import userReducer from "../features/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    shelves: shelfReducer,
    users: userReducer,
  },
});
