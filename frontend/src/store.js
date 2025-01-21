import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './features/user/UserSlice';
import PostSlice from './features/post/PostSlice';

export const store = configureStore({
  reducer: {
    user: UserSlice,
    
    post:PostSlice
  },
});