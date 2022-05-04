import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '../components/Headers/Header';

export const DefaultLayout: React.FC = ({ children }) => {
    return (
        <>
            <Header />
            {children ? children : <Outlet />}
        </>
    );
};
