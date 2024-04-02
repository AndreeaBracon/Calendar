import React, { useContext, useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Modal, TextField } from '@mui/material';
import { CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { AuthContext } from 'src/contexts/AuthContextProvider'; // Adjust the import path as needed
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import useRequestAuth from 'src/hooks/useRequestAuth';

const drawerWidth = 240;

// Define any additional styles
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function AppHeader({ toggleDrawer }) {
  const { user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const open = Boolean(anchorEl);
  const {logout, logoutPending } = useRequestAuth();

  const handleLogout= () => {
    logout();
  }


  const handleDrawerToggle = () => {
    toggleDrawer(); // Assuming this function toggles the drawer's state
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
    handleClose(); // Close the menu when opening the modal
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  // Define the modal content
  const modalContent = (
    <Modal
      open={modalIsOpen}
      onClose={handleCloseModal}
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Profile
        </Typography>
        <TextField
          id="username"
          variant="outlined"
          label="Username"
          value={user ? user.username : ""}
          disabled
          sx={{ m: 3, width: "100%" }}
        />
        <TextField
          id="email"
          variant="outlined"
          label="Email"
          value={user ? user.email : ""}
          disabled
          sx={{ m: 3, width: "100%" }}
        />
      </Box>
    </Modal>
  );

  // Define the auth links (profile icon and menu)
  const authLinks = (
    <Box sx={{ display: 'flex', alignItems: "center" }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenModal}>Profile</MenuItem>
        <MenuItem disabled={logoutPending} onClick={handleLogout}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            {logoutPending === true ? <CircularProgress size={20}
             sx={{
                  mr:2
                }} /> : null}
          </Box>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <AppBar position="fixed"
      sx={{
        width: { mb: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer +1,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          To Do
        </Typography>
        {authLinks}
      </Toolbar>
      {modalContent}
    </AppBar>
  );
}

// Define PropTypes for the AppHeader component
AppHeader.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
};
