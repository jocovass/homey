import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Global } from '@emotion/react';

import { useUser, getCurrentUser } from '../context/userContext';
import { globalStyles } from '../styles/theme';
import { Login } from '../components/Login/Login';
import { Signup } from '../components/Signup/Signup';
import { DefaultLayout } from '../layout/Default';
import { DashboardLayout } from '../layout/Dashboard';
import { Homepage } from './Homepage/Homepage';
import { Dashboard } from './Dashboard/Dashboard';
import { UserSettings } from './UserSettings/UserSettings';

function App() {
    const { dispatch } = useUser();
    const navigat = useNavigate();

    React.useEffect(() => {
        getCurrentUser(dispatch).then(() =>
            navigat('/dashboard', { replace: true }),
        );
    }, []);

    // const isLoading = status === 'pending';

    // if (isLoading) return <div>Loading bazz...</div>;

    return (
        <div className="">
            <Global styles={globalStyles} />
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route index element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
                <Route path="dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="settings/*" element={<UserSettings />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
