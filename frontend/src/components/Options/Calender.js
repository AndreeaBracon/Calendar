import React, { useState, useEffect } from 'react';
import { Grid, Box, Button, Divider, List, ListItem, Checkbox, ListItemText, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import 'src/Style/index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import useRequestResource from 'src/hooks/useRequestResource';
import AddEventSideBar from './AddEventSideBar';
import { fetchEvents } from 'src/store/events';
import { CustomAgenda, CustomAgendaHeader } from './Agenda';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [checkboxes, setCheckboxes] = useState({ view: true });

  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);
  const { getResourceList: getCategoryList, resourceList: categoryList } = useRequestResource({
    endpoint: 'categories', 
    resourceLabel: 'Category'
  });

  useEffect(() => {
    getCategoryList();
    dispatch(fetchEvents());
  }, [getCategoryList, dispatch]);

  useEffect(() => {
    if (categoryList && categoryList.results) {
      const initialCheckboxes = { view: true };
      categoryList.results.forEach(category => {
        initialCheckboxes[category.id] = true;
      });
      setCheckboxes(initialCheckboxes);
    }
  }, [categoryList]);

  const handleViewCheckboxChange = (event) => {
    const newCheckboxes = { ...checkboxes, view: event.target.checked };
    Object.keys(newCheckboxes).forEach(key => {
      if (key !== 'view') newCheckboxes[key] = event.target.checked;
    });
    setCheckboxes(newCheckboxes);
  };

  const handleCategoryCheckboxChange = (categoryId, event) => {
    const newCheckboxes = { ...checkboxes, [categoryId]: event.target.checked };
    const allChecked = Object.keys(newCheckboxes).every(key => key === 'view' || newCheckboxes[key]);
    newCheckboxes.view = allChecked ? event.target.checked : checkboxes.view;
    setCheckboxes(newCheckboxes);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent({
      ...event,
      category: event?.category,
      title: event?.name,
      startDate: event?.start ? moment(event.start).format('YYYY-MM-DD') : '',
      endDate: event?.end ? moment(event.end).format('YYYY-MM-DD') : '',
      allDay: event?.allDay,
    });
    setSideBarOpen(true);
  };

  const getCategoryColor = (categoryId) => {
    const category = categoryList.results.find(c => c.id === categoryId);
    return category ? `#${category.color}` : null;
  };

  const calendarEvents = events.filter(event => checkboxes[event.category]).map(event => ({
    ...event,
    title: event.name,
    start: new Date(event.start),
    end: new Date(event.end),
    allDay: event.all_day,
    id: event.id,
    categoryId: event.category
  }));

  const eventStyleGetter = (event, start, end, isSelected) => ({
    style: {
      backgroundColor: currentView !== 'agenda' ? getCategoryColor(event.categoryId) : null,
      borderRadius: '0px',
      opacity: 0.8,
      color: currentView !== 'agenda' ? 'white' : 'black',
      border: '0px',
      display: 'block'
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid item xs={8} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <Button onClick={() => setSideBarOpen(!sideBarOpen)} variant="contained" startIcon={<AddIcon />}>
              Add Event
            </Button>
            <AddEventSideBar
              mobileOpen={sideBarOpen}
              closeDrawer={() => { setSideBarOpen(false); setSelectedEvent(null); }}
              selectedEvent={selectedEvent}
            />
          </Box>
          <Divider />
          <FormControlLabel
            control={<Checkbox checked={checkboxes.view} onChange={handleViewCheckboxChange} />}
            label="View"
          />
          <List sx={{ width: '100%', marginLeft: 4 }}>
            {categoryList?.results?.map(resource => (
              <ListItem key={resource.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxes[resource.id] || false}
                      onChange={event => handleCategoryCheckboxChange(resource.id, event)}
                      sx={{ color: resource.color, '&.Mui-checked': { color: `#${resource.color}` } }}
                    />
                  }
                  label={resource.name}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={9}>
          <div style={{ height: '700px', width: '90%' }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              onSelectEvent={handleEventSelect}
              eventPropGetter={eventStyleGetter}
              components={{ agenda: { event: CustomAgenda } }}
              view={currentView}
              onView={setCurrentView}
            />
          </div>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}