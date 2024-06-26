import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Drawer, Typography, TextField, Button, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { useSnackbar } from 'notistack';
import moment from 'moment';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFnsV3';
import DeleteIcon from '@mui/icons-material/Delete';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import useRequestResource from 'src/hooks/useRequestResource';
import { addEvent, updateEvent, deleteEvent } from 'src/store/events';
import { useDispatch } from 'react-redux';


const drawerWidth = 300;

export default function AddEventSideBar({ mobileOpen, closeDrawer, selectedEvent}) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { control, handleSubmit, register, reset, formState: { errors } } = useForm({
    defaultValues: selectedEvent || {
      title: '',
      categories: '',
      startDate: null,
      endDate: null,
      allDay: false,
      url: '',
    }
  });

  const { getResourceList, resourceList } = useRequestResource({
    endpoint: 'categories',
    resourceLabel: 'Category'
  });

  useEffect(() => {
    getResourceList();
  }, [getResourceList]);

  const onSubmit = (data) => {
    console.log('data', data)
    const formattedData = {
      name: data.title,
      start: data.startDate,
      end: data.endDate,
      allDay: data.allDay,
      url: data.url,
      category: data.category
      // Include other fields as neededconsole.log
    };

    if (selectedEvent?.id) {
      // Update existing event
      dispatch(updateEvent({ id: selectedEvent.id, ...formattedData }))
        .unwrap()
        .then(() => {
          enqueueSnackbar('Event updated successfully', { variant: 'success' });
          closeDrawer();
        })
        .catch((error) => {
          // Handle error
        });
    } else {

    dispatch(addEvent(formattedData))
      .unwrap()
      .then((events) => {
        enqueueSnackbar('Event added successfully', { variant: 'success' });
        closeDrawer();
      })
      .catch((error) => {
        // Correctly extracting and showing the error message
        const errorMessage = error.response && error.response.data && error.response.data.detail
          ? error.response.data.detail
          : error.message || 'An unknown error occurred';
      
        enqueueSnackbar(`Error adding event: ${errorMessage}`, { variant: 'error' });
        console.error('Error adding event:', errorMessage);
      });
  }};

  const handleDelete = () => {
    if (selectedEvent?.id) {
      dispatch(deleteEvent(selectedEvent.id))
        .unwrap()
        .then(() => {
          enqueueSnackbar('Event deleted successfully', { variant: 'success' });
          closeDrawer();
        })
        .catch((error) => {
          const errorMessage = error.response && error.response.data && error.response.data.detail
            ? error.response.data.detail
            : error.message || 'An unknown error occurred';
          enqueueSnackbar(`Error deleting event: ${errorMessage}`, { variant: 'error' });
        });
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      reset({
        title: selectedEvent.title,
        category: selectedEvent.category, // Use "category" instead of "categories"
        startDate: moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm:ssZ'),
        endDate: moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm:ssZ'),
        allDay: selectedEvent.allDay,
        url: selectedEvent.url
      });
    } else {
      reset({
        title: '',
        category: '', // Use "category" instead of "categories"
        startDate: '',
        endDate: '',
        allDay: false,
        url: '',
      });
    }
    console.log('selectedEvent', selectedEvent);
  }, [selectedEvent, reset]);


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeDrawer}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 3, mt: 6, justifyContent: 'space-between' }}>
          <Typography variant="h6">Add Event</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Title"
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ''}
                  sx={{ mb: 2, mt: 2 }}
                />
              )}
            />
            <Controller
              name="category" // Ensure this matches the expected field in the form.
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Category"
                  error={!!errors.category}
                  helperText={errors.category ? errors.category.message : ''}
                  sx={{ mb: 2 }}
                >
                  {resourceList.results && resourceList.results.map((resource) => (
                    <MenuItem key={resource.id} value={resource.id}>{resource.name}</MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start date is required' }}
              render={({ field }) => (
                <DateTimePicker
                inputVariant="outlined"
                size='small'
                  label="Start Date"
                  {...field}
                  renderInput={(params) => <TextField {...params} error={!!errors.startDate} helperText={errors.startDate ? errors.startDate.message : '' } />}
                  sx={{ mb: 2 }}
                  ampm={false}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              rules={{ required: 'End date is required' }}
              render={({ field }) => (
                <DateTimePicker
                  label="End Date"
                  {...field}
                  renderInput={(params) => <TextField {...params} error={!!errors.endDate} helperText={errors.endDate ? errors.endDate.message : ''} />}
                  minDate={control._formValues.startDate}
                  ampm={false}
                />
              )}
            />

            {/* <DateTimePicker
              {...register("startDate", { required: 'Start date is required' })}
              fullWidth
              label="Start Date"
              type="date"
              renderInput={(params) => <TextField {...params} />}
              error={!!errors.startDate}
              helperText={errors.startDate ? errors.startDate.message : ''}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              {...register("endDate", { required: 'End date is required' })}
              fullWidth
              label="End Date"
              type="date"
              error={!!errors.endDate}
              helperText={errors.endDate ? errors.endDate.message : ''}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            /> */}
            <Controller
              name="allDay"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} />}
                  label="All Day"
                />
              )}
              sx={{ mb: 2 }}
            />
            <TextField
              {...register("url")}
              fullWidth
              label="Event URL"
              type="url"
              error={!!errors.url}
              helperText={errors.url ? errors.url.message : ''}
              sx={{ mb: 2 }}
            />
            {/* Include other fields as needed */}
            <Button type="submit" variant="contained">Submit</Button>
            <Button variant="outlined" startIcon={<DeleteIcon />} sx={{ml:7}} onClick={handleDelete}>
              Delete
            </Button>
          </form>
        </Box>
      </Drawer>
    </LocalizationProvider>

);
}
