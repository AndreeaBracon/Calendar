import { useCallback, useState, useContext} from "react";
import axios from 'axios';
import { useSnackbar } from "notistack";

import formatHttpApiError from "src/helpers/formatHttpApiErrors";
import { LoadingOverlayResourceContext } from "src/components/LoadingOverlayResources";
import getCommonOptions from "src/helpers/axios/getCommonOptions";

export default function useRequestResource({ endpoint, resourceLabel }) {
  const [resourceList, setResourceList] = useState({
    results: [],
  });
  const [resource, setResource] = useState(null);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const loadingOverlay = useContext(LoadingOverlayResourceContext);
  const { setLoading } = loadingOverlay; 

  const handleRequestResourceError = useCallback((err) => {
    const formattedError = formatHttpApiError(err);
    setError(formattedError);
    setLoading(false);
    enqueueSnackbar(formattedError);

  },[enqueueSnackbar, setError, setLoading])

  const getResourceList = useCallback(() => {
    setLoading(true);
    // Return the Axios promise chain here
    return axios.get(`/api/${endpoint}/`, getCommonOptions())
      .then((res) => {
        setLoading(false);
        setResourceList({
          results: res.data
        });
        // console.log('res.data', res.data)
        return res.data; 
        // Resolve the promise with the data
      })
      .catch(handleRequestResourceError); // This will return a rejected promise in case of error
  }, [endpoint, handleRequestResourceError, setLoading]);
   

  // const addResource = useCallback(
  //   (values, successCallback) => {
  //     setLoading(true)
  //     axios.post(`/api/${endpoint}/`, values, getCommonOptions())
  //       .then(() => {
  //         setLoading(false);
  //         enqueueSnackbar(`${resourceLabel} added`)
  //         if (successCallback) {
  //           successCallback();
  //         }
  //       })
  //       .catch(handleRequestResourceError)
  //   }, [endpoint, enqueueSnackbar, resourceLabel, handleRequestResourceError, setLoading]); 

  const addResource = useCallback(async (values) => {
    setLoading(true); // Assume setLoading is part of the component's state management
    try {
      const response = await axios.post(`/api/${endpoint}/`, values, getCommonOptions());
      setLoading(false);
      enqueueSnackbar(`${resourceLabel} added`); // Show success message
      return response;
    } catch (error) {
      setLoading(false);
      handleRequestResourceError(error); // Handle errors
      return await Promise.reject(error);
    }
}, [endpoint, enqueueSnackbar, resourceLabel, handleRequestResourceError, setLoading]);

    const getResource = useCallback((id) => {
      setLoading(true)
      axios
        .get(`/api/${endpoint}/${id}/`, getCommonOptions())
        .then((res) => {
          setLoading(false)
          const { data } = res; 
          setResource(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, [endpoint, enqueueSnackbar, handleRequestResourceError, setLoading]);

    const updateResource = useCallback((
      id, values, successCallback) => {
        setLoading(true)
        axios.patch(`/api/${endpoint}/${id}/`, values, getCommonOptions())
          .then(() => {
            setLoading(false)
            enqueueSnackbar(`${resourceLabel} updated`)
            if(successCallback) {
              successCallback();
            }
          }).catch(handleRequestResourceError);
    }, [endpoint, enqueueSnackbar, resourceLabel, handleRequestResourceError, setLoading])

    const deleteResource = useCallback((id) => {
      setLoading(true)
      axios.delete (`/api/${endpoint}/${id}/`, getCommonOptions())
      .then(() => {
        setLoading(false)
        enqueueSnackbar(`${resourceLabel} deleted`)
        const newResourceList = {
          results: resourceList.results.filter((r) => {
            return r.id !== id
          })
        }
        setResourceList(newResourceList);
      }).catch(handleRequestResourceError);
    }, [endpoint,resourceList, enqueueSnackbar, resourceLabel, handleRequestResourceError, setLoading])

    const saveReminder = useCallback((id, reminderDateTime, successCallback) => {
      // Ensure Axios call is directly returned
      return axios.patch(`/api/${endpoint}/${id}/set-reminder/`, { reminderDateTime: reminderDateTime.toISOString() }, getCommonOptions())
        .then((response) => {
          setLoading(false);
          enqueueSnackbar(`${resourceLabel} reminder set`);
          if (successCallback) {
            successCallback(response.data);
          }
        })
        .catch(handleRequestResourceError);
    }, [endpoint, enqueueSnackbar, setLoading, handleRequestResourceError]);
    
    
    
  return {
    resourceList,
    getResourceList,
    addResource,
    resource,
    getResource,
    updateResource,
    deleteResource,
    saveReminder,
    error
  };
}