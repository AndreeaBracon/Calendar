import { useState } from 'react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import SideMenu from './SideMenu'

export default function BaseLayout() {
    const [mobileOpen, setMobileOpen]=useState(false);
    

  return (
    <>
      <AppHeader toggleDrawer={() => setMobileOpen(!mobileOpen)} />
      <SideMenu mobileOpen={mobileOpen} closeDrawer={() => setMobileOpen(false)} />
    </>
  );
}
