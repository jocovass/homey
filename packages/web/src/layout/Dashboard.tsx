import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

import { Header } from '../components/Header/Header';
import { DashboardNav } from '../components/Navigation/DashboardNav';
import { SideModal } from '../components/SideModal/SideModal';

const StyledDashboard = styled.div`
    margin-right: clamp(0px, 30vw, 450px);
    height: 1000px;
`;

export const DashboardLayout: React.FC = ({ children }) => {
    return (
        <StyledDashboard>
            <Header>
                <DashboardNav />
            </Header>
            <SideModal />
            {children ? children : <Outlet />}
        </StyledDashboard>
    );
};
