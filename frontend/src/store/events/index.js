import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming axios for API calls
import getCommonOptions from 'src/helpers/axios/getCommonOptions';

// Async thunk for fetching events
export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/', getCommonOptions());
      const events = response.data || [];
      console.log('events',events)
      return events;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
  });

// Async thunk for adding an event
export const addEvent = createAsyncThunk('events/addEvent', async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/', eventData, getCommonOptions());
      return response.data;
    } catch (error) {
      // check for error.response and log the detailed server response if available
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Server did not respond to the request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
      
    }
    });

    // Async thunk for updating an event
export const updateEvent = createAsyncThunk('events/updateEvent', async ({ id, ...eventData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/tasks/${id}/`, eventData, getCommonOptions());
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with:', error.response.data);
    } else if (error.request) {
      console.error('Server did not respond to the request:', error.request);
    } else {
      console.error('Error', error.message);
    }
    return rejectWithValue(error.response ? error.response.data : 'An error occurred');
  }
});

// Async thunk for deleting an event
export const deleteEvent = createAsyncThunk('events/deleteEvent', async (eventId, { rejectWithValue }) => {
  try {
    // Note: Assuming your API endpoint for deleting an event requires an HTTP DELETE request
    await axios.delete(`http://localhost:8000/api/tasks/${eventId}/`, getCommonOptions());
    // Since the delete operation does not typically return data, just return the eventId to remove it from the state
    return eventId;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with:', error.response.data);
    } else if (error.request) {
      console.error('Server did not respond to the request:', error.request);
    } else {
      console.error('Error', error.message);
    }
    return rejectWithValue(error.response ? error.response.data : 'An error occurred');
  }
});

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload|| 'Unknown error occurred';
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        const eventId = action.payload;
        state.events = state.events.filter(event => event.id !== eventId);
      });
  },
});

export default eventsSlice.reducer;
