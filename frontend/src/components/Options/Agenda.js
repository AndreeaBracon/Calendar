import React from 'react';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography } from '@mui/material';
import moment from 'moment';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from 'src/store/events';

import { fetchEvents as fetchEventsAction } from 'src/store/events';

// Define the custom agenda header component
// export const CustomAgendaHeader = ({ label }) => {

//   console.log('Header Label:', label);
//   // This will split the label to separate the day and the date.
//   const [dayOfWeek, ...dateArray] = label.split(' ');
//   const date = dateArray.join(' ');

//   console.log('Agenda Header:', { dayOfWeek, date }); // Debug log for header

//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
//       <Typography variant="h4" component="div">
//         {dayOfWeek}
//       </Typography>
//       <Typography variant="subtitle" component="div" sx={{color: 'blue'}}>
//         {date}
//       </Typography>
//     </div>
//   );
// };

export const CustomAgenda = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const events = useSelector((state) => state.events.events);

  const fetchEvents = () => {
    dispatch(fetchEventsAction())
      .then(() => {
        // Handle successful response
      })
      .catch((error) => {
        setError(error);
      });
  };

  // Call the fetchEvents function when the component is mounted
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter the events to only include today's and future events
  const todayOrFutureEvents = events ? events.filter(event => {
    const today = moment().startOf('day').year(moment().year());
    const eventStart = moment(event.start);
    return eventStart.isSameOrAfter(today);
  }) : null;

  // Transform the events data into the desired format
  const transformedEvents = todayOrFutureEvents.map(event => ({
    ...event,
    title: event.name,
    start: new Date(event.start),
    end: new Date(event.end),
    allDay: event.all_day,
    id: event.id,
    categoryId: event.category
  }));

  // A function to format the event date as needed
  const formatDate = (date) => moment(date).format('DD ddd MMM');
  const formatTime = (event) => {
    if (event.allDay) {
      return 'All day';
    }
    if (event.start && event.end) {
      return `${moment(event.start).format('h:mm a')} - ${moment(event.end).format('h:mm a')}`;
    } else {
      console.error('Event start or end is undefined', event);
      return ''; // Return an empty string or some default value
    }
  };

  // Order eventsGroupedByDay by date
  const orderedEventsGroupedByDay = _(transformedEvents)
    .groupBy(event => formatDate(event.start))
    .toPairs()
    .sort((a, b) => moment(a[0], 'DD ddd MMM').diff(moment(b[0], 'DD ddd MMM')))
    .fromPairs()
    .value();

  console.log('Ordered Events:', orderedEventsGroupedByDay); // Debug log for all ordered events

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {Object.entries(orderedEventsGroupedByDay).map(([day, dayEvents]) => {
            // Console log for each day
            console.log('Day:', day);
            console.log('Day Events:', dayEvents);

            return (
              <React.Fragment key={day}>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="h6" component="div" sx={{color: 'blue'}}>
                      {day}
                    </Typography>
                  </TableCell>
                </TableRow>
                {dayEvents.map((event) => {
                  // Console log for each event title
                  console.log('Event Title:', event.title);
                  return (
                    <TableRow key={event.id}>
                      <TableCell>{formatTime(event)}</TableCell>
                      <TableCell>{event.title}</TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

