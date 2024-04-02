import { useCallback } from 'react';
import useRequestResource from './useRequestResource';

export default function useEventResource() {
    // Use the hook for events
    const {
        resourceList: eventList,
        getResourceList,
        addResource,
        updateResource,
        deleteResource
    } = useRequestResource({ endpoint: 'tasks', resourceLabel: 'Event' });

    // Wrap getResourceList in useCallback to memoize it and avoid unnecessary re-fetches
    const getEventList = useCallback(async () => {
        try {
          const response = await getResourceList();
           // Assuming this fetches data asynchronously
          return response; // This should be a Promise
        } catch (error) {
          console.error('Error fetching event list:', error);
          return Promise.reject(error); // Return a rejected Promise in case of error
        }
      }, [getResourceList]);


const addEvent = useCallback(async (eventData, onSuccess) => {
    try {
        // Await the promise returned by addResource
        await addResource(eventData);
        console.log('Event added successfully', eventData);
        
        // If there's an onSuccess callback, call it.
        if (onSuccess) onSuccess();

        // Await the refreshing/retrieving of the event list.
        await getEventList();
    } catch (error) {
        // Handle any errors that might occur during the addResource or getEventList calls
        console.error("An error occurred:", error);
    }
}, [addResource, getEventList]);

  // Similarly wrap other operations if needed
  const updateEvent = useCallback((...params) => {
      updateResource(...params);
  }, [updateResource]);

  const deleteEvent = useCallback((...params) => {
      deleteResource(...params);
  }, [deleteResource]);

  return {
      eventList,
      getEventList,
      addEvent,
      updateEvent,
      deleteEvent,
  };
}