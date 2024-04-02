import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const drawerWidth = 240;

export default function SideMenu({ mobileOpen, closeDrawer }) {
  return (
    <>
      <Drawer

        anchor="left"
        open={mobileOpen}
        onClose={closeDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <List sx={{ mt: '64px' }}>
          <ListItem onClick={closeDrawer}>
            <ListItemIcon><CheckCircleOutlineIcon /></ListItemIcon>
            <ListItemText primary="Item 1" />
          </ListItem>
          <ListItem onClick={closeDrawer}>
            <ListItemIcon><CheckCircleOutlineIcon /></ListItemIcon>
            <ListItemText primary="Item 2" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: mobileOpen ? `${drawerWidth}px` : 0,
          width: mobileOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        }}
      >
        {<Outlet />}
      </Box>
    </>
  );
}
