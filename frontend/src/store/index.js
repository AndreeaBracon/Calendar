import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './events';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
});
