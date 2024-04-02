import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Box, Button, Divider, List, ListItem, Checkbox, ListItemText, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import 'src/Style/index.css'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Calendar, momentLocalizer, Agenda } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useRequestResource from 'src/hooks/useRequestResource'; // Ensure this path is correct
import AddEventSideBar from './AddEventSideBar'; // Ensure this path is correct


import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from 'src/store/events';

// import CustomAgenda from './Agenda';
// import {CustomAgendaHeader } from './Agenda';

import { CustomAgenda, CustomAgendaHeader } from './Agenda'; // Adjust the path as needed

const localizer = momentLocalizer(moment);


export default function CalendarPage() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [currentView, setCurrentView] = useState('month');

  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const { getResourceList: getCategoryList, resourceList: categoryList } = useRequestResource({
    endpoint: 'categories', 
    resourceLabel: 'Category'
  });

  const getCategoryColor = (categoryId) => {
    const category = categoryList.results.find((c) => c.id === categoryId);
    return category ? `#${category.color}` : null;
    
  };

  const calendarEvents = events ? events.map(event => ({
    ...event,
    title: event.name,
    start: new Date(event.start),
    end: new Date(event.end),
    allDay: event.all_day,
    id: event.id,
    categoryId: event.category
  })): [];


  // assign styles to events on the calendar
  const eventStyleGetter = (event, start, end, isSelected) => {
    if (currentView !== 'agenda') {
      const backgroundColor = getCategoryColor(event.categoryId);
      return {
        style: {
          backgroundColor: backgroundColor,
          borderRadius: '0px',
          opacity: 0.8,
          color: 'white',
          border: '0px',
          display: 'block'
        }
      };
    } else {
      // Default styles for agenda view (no background color)
      return {
        style: {
          borderRadius: '0px',
          color: 'black', // you might want to adjust the color for better readability
          border: '0px',
          display: 'block'
        }
      };
    }
  };
  
  useEffect(() => {
    getCategoryList();
  }, [getCategoryList]);
  

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);
  
  const toggleSidebar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const handleEventSelect = (event) => {
    const eventForForm = {
      ...event,
      category: event?.category, // Using optional chaining
      title: event?.name,
      startDate: event?.start ? moment(event.start).format('YYYY-MM-DD') : '',
      endDate: event?.end ? moment(event.end).format('YYYY-MM-DD') : '',
      allDay: event?.allDay,
      // other properties
    };
  
    setSelectedEvent(eventForForm);
    setSideBarOpen(true);
  };

 

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid item xs={8} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
            <Button onClick={toggleSidebar} variant="contained" startIcon={<AddIcon />}>
              Add Event
            </Button>
            {/* <AddEventSideBar mobileOpen={sideBarOpen} closeDrawer={() => setSideBarOpen(false)} /> */}
            <AddEventSideBar
              mobileOpen={sideBarOpen}
              closeDrawer={() => { setSideBarOpen(false); setSelectedEvent(null); }} // Also reset selectedEvent on close
              selectedEvent={selectedEvent} // Pass the selected event to the sidebar
            />
            <DatePicker
            value={selectedDate}
            onChange={(newDate) => {
              setSelectedDate(newDate);
              // Additional actions when a new date is selected, if necessary
            }}
            renderInput={(params) => <TextField {...params} />}
            sx={{ width: '80%', marginTop: 2 }}
          />
          </Box>
          <Divider />
          <List sx={{ width: '100%', marginLeft: 4 }}>
            {categoryList && categoryList.results && categoryList.results.map((resource) => (
              <ListItem key={resource.id}>
                <Checkbox
                  sx={{
                    color: resource.color,
                    '&.Mui-checked': {
                      color: `#${resource.color}`,
                    },
                  }}
                />
                <ListItemText primary={resource.name} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={9}>
          <div style={{ height: '700px' }}> {/* Ensure the container has a height */}
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            titleAccessor='title'
            onSelectEvent={handleEventSelect}
            eventPropGetter={eventStyleGetter}
            components={{
              agenda: {
                event: CustomAgenda,
                // header: CustomAgendaHeader
              },
            }}
            view={currentView}
            onView={newView => setCurrentView(newView)}
            endAccessor={(event) => {
              if (!event || !event.end) {
                console.error('Invalid event', event);
                return new Date(); // return current date as a fallback
              }
              // Adjust the endAccessor to include the end date if it ends at midnight
              const isMidnight = moment(event.end).format('HH:mm:ss') === '00:00:00';
              return isMidnight ? moment(event.end).add(1, 'days').toDate() : event.end;
            }}
            style={{ height: '100%' }}
          />
            </div>
        </Grid>
      </Grid>
    </LocalizationProvider>
  )}