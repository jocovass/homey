import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '../components/Header/Header';
import { DefaultNav } from '../components/Navigation/DefaultNav';

export const DefaultLayout: React.FC = ({ children }) => {
    return (
        <>
            <Header>
                <DefaultNav />
            </Header>
            {children ? children : <Outlet />}
        </>
    );
};
