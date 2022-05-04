import { Routes, Route } from 'react-router-dom';
import { Global } from '@emotion/react';

import { globalStyles } from '../styles/theme';
import { UserProvider } from '../context/userContext';
import { Login } from '../components/Login/Login';
import { Signup } from '../components/Signup/Signup';
import { DefaultLayout } from '../layout/Default';
import { DashboardLayout } from '../layout/Dashboard';
import { Homepage } from './Homepage/Homepage';
import { Dashboard } from './Dashboard/Dashboard';

function App() {
    return (
        <div className="">
            <Global styles={globalStyles} />
            <UserProvider>
                <Routes>
                    <Route path="/" element={<DefaultLayout />}>
                        <Route index element={<Homepage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>
                    <Route path="dashboard" element={<DashboardLayout />}>
                        <Route index element={<Dashboard />} />
                    </Route>
                </Routes>
            </UserProvider>
        </div>
    );
}

export default App;
