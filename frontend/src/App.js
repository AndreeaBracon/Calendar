import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Box from '@mui/system/Box';
import { SnackbarProvider } from "notistack";

import Categories from "./pages/Categories";
import CategoryDetails from "./pages/Categories/CategoryDetails";
import LoadingOverlayResource from "./components/LoadingOverlayResources";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import AuthContextProvider from "./contexts/AuthContextProvider";
import RequireAuth from "./components/RequireAuth";
import RequireNotAuth from "./components/RequireNotAuth";
import BaseLayout from "./components/BaseLayout.js";
import CalendarPage from "./components/Options/Calender";
import TestComponent from "./hooks/Test";

import { Provider } from 'react-redux';
import { store } from './store'


export default function App() {
  return (
    <Provider store={store}>
      <CssBaseline>
        <LoadingOverlayResource>
          <AuthContextProvider>
            <SnackbarProvider>
              <Router>
                <Box
                  marginTop='64px'
                  component='main'
                  sx={{
                    width:'100%',
                    minHeight: "100vh",
                    mr:'2px'
                  }}
                >
                  <Routes>
                    
                    <Route element={<RequireAuth />}>
                      <Route element={<BaseLayout />}>
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/categories/create" element={<CategoryDetails />} />
                        <Route path={`/categories/edit/:id`} element={<CategoryDetails />} />
                        <Route path={`/categories/calendar`} element={<CalendarPage />} />
                        <Route path={`/categories/test`} element={<TestComponent />} />
                      </Route>
                      
                    </Route>
                    <Route element={<RequireNotAuth />}>
                      <Route path={"/auth/signup"} element={<SignUp />} />
                      <Route path={"/auth/signin"} element={<SignIn />} />
                    </Route>
                  </Routes>
                </Box>
              </Router>
            </SnackbarProvider>
          </AuthContextProvider>
          
        </LoadingOverlayResource>      
      </CssBaseline>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
