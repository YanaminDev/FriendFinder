import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import userImageReducer from './userImageSlice';
import userInformationReducer from './userInformationSlice';
import userLifeStyleReducer from './userLifeStyleSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    userImage: userImageReducer,
    userInformation: userInformationReducer,
    userLifeStyle: userLifeStyleReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
