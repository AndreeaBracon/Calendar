import React from 'react'
import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {Box, Paper, Table, TableBody, TableCell, TableContainer, IconButton, Dialog, DialogActions, DialogTitle, DialogContent} from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import useRequestResource from 'src/hooks/useRequestResource';
import ColorBox from 'src/components/ColorBox';



export default function Categories () {
    const {getResourceList, resourceList, deleteResource, saveReminder} = useRequestResource({
        endpoint:'categories', resourceLabel: 'Category'
    });
    const[ open, setOpen] = useState(false);
    const[idToDelete, setIdToDelete] = useState(null);
    const [openReminderDialog, setOpenReminderDialog] = useState(false);
    const [reminderDateTime, setReminderDateTime] = useState(new Date());
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    useEffect(() => {
        getResourceList();
    }, [getResourceList])

    const handelConfirmDelete = (id) => {
        setIdToDelete(id);
        setOpen(true);
    }

    const handleDeleteClose = () => {
        setOpen(false);
    }

    const handleDelete = () => {
        setOpen(false);
        deleteResource(idToDelete);
    }

    const handleAddReminder = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setOpenReminderDialog(true);
    };

    const handleReminderClose = () => {
        setOpenReminderDialog(false);
    };

    const handleSetReminder = () => {
        const promise = saveReminder(selectedCategoryId, reminderDateTime);
        // Assuming saveReminder expects the category ID and the reminder date/time directly
        saveReminder(selectedCategoryId, reminderDateTime)
            .then(() => {
                setOpenReminderDialog(false);
                // Optionally, refresh the list or state to reflect the newly set reminder
                getResourceList();
            })
            .catch(error => {
                console.error('Error setting reminder:', error);
            });
    };
    

    return(
        <div>
            <Dialog open={open} onClose={handleDeleteClose}>
                <DialogTitle>
                    Are you sure you want to delete this category?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleDelete}>
                        Yes
                    </Button>
                    <Button onClick={handleDeleteClose}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openReminderDialog} onClose={handleReminderClose}>
                <DialogTitle>Set a Reminder</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={ AdapterDateFns }>
                        <DatePicker 
                            renderInput={(props) => <TextField {...props} />}
                            label="Date & Time"
                            value={reminderDateTime}
                            onChange={setReminderDateTime}
                            sx={{mt:2}}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSetReminder}>Set</Button>
                    <Button onClick={handleReminderClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Box sx=
                {{
                    display:'flex',
                    justifyContent:'flex-end',
                    mb: 4,
                    mt: 4
                }}
            >
                <Button
                    component={Link}
                    variant='contained'
                    color='primary'
                    to='/categories/create'
                >
                    Create Category
                </Button>

            </Box>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 360}} size ='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Color</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resourceList.results.map((r) => {
                            return <TableRow key={r.id}>
                                <TableCell align='left'>{r.name}</TableCell>
                                <TableCell align='left'>
                                    <ColorBox color={`#${r.color}`} />
                                </TableCell>
                                <TableCell align='right'>
                                    <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                                    <IconButton
                                        size='large'
                                        sx={{mt:2, mr:2}}
                                        onClick={() => handleAddReminder(r.id)}
                                        color={r.hasReminder ? "secondary" : "default"}
                                        >
                                        <NotificationsNoneOutlinedIcon />
                                    </IconButton>
                                        <Link to={`/categories/edit/${r.id}`}
                                            key='category-edit'>
                                                <IconButton size='large'>
                                                    <EditIcon />
                                                </IconButton>
                                            </Link>
                                            <IconButton size='lage'
                                             onClick={() => {
                                                handelConfirmDelete(r.id)
                                             }}>
                                                <DeleteIcon />
                                            </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}