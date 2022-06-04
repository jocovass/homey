import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

import { Header } from '../components/Header/Header';
import { DashboardNav } from '../components/Navigation/DashboardNav';
import { SideModal } from '../components/SideModal/SideModal';

const StyledDashboard = styled.div`
    margin-right: clamp(0px, 30vw, 450px);

    .content {
        padding: 1.5rem 5vw;
        margin: 3rem 0;
    }
`;

export const DashboardLayout: React.FC = ({ children }) => {
    return (
        <StyledDashboard>
            <Header>
                <DashboardNav />
            </Header>
            <SideModal />
            <div className="content">{children ? children : <Outlet />}</div>
        </StyledDashboard>
    );
};
