import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '../components/Header/Header';

export const DefaultLayout = ({
    children,
}: {
    children?: React.ReactElement[] | React.ReactElement;
}) => {
    return (
        <>
            <Header />
            {children ? children : <Outlet />}
        </>
    );
};
