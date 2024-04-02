import React, { useEffect, useState } from 'react';
import useEventResource from './useEventResources';

const TestComponent = () => {
  const { getEventList } = useEventResource();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEventList().then(fetchedEvents => {
      console.log('Fetched Events:', fetchedEvents);
      setEvents(fetchedEvents);
    }).catch(error => {
      console.error('Error fetching events:', error);
    });
  }, [getEventList]);

  // The rest of your component rendering logic...
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
};

export default TestComponent;
