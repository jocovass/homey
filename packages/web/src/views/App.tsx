import { Routes, Route } from 'react-router-dom';
import { Global } from '@emotion/react';

import { globalStyles } from '../styles/theme';
import { UserProvider } from '../context/userContext';
import { Login } from '../components/Login/Login';
import { Signup } from '../components/Signup/Signup';
import { DefaultLayout } from '../layout/Default';
import { Dashboard } from './Dashboard/Dashboard';
import { Homepage } from './Homepage/Homepage';

function App() {
    return (
        <div className="">
            <Global styles={globalStyles} />
            <UserProvider>
                <Routes>
                    <Route path="/" element={<DefaultLayout />}>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </UserProvider>
        </div>
    );
}

export default App;
