import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Global } from '@emotion/react';

import { globalStyles } from '../styles/theme';
import { AuthProvider } from '../context/authContext';
import { Login } from '../components/Login/Login';
import { Signup } from '../components/Signup/Signup';
import { DefaultLayout } from '../layout/Default';
import { Dashboard } from './Dashboard/Dashboard';
import { Homepage } from './Homepage/Homepage';

function App() {
    return (
        <div className="">
            <Global styles={globalStyles} />
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<DefaultLayout />}>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </AuthProvider>
        </div>
    );
}

export default App;
