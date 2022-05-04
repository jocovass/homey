import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

import { Header } from '../components/Headers/DahboardHeader';

const StyledSideModal = styled.aside`
    background-color: #fff;
    position: fixed;
    top: 0;
    right: 0;
    width: 33vw;
    height: 100vh;
    max-width: 500px;
`;

const StyledDashboard = styled.div`
    margin-right: clamp(0px, 30vw, 450px);
    height: 1000px;
`;

export const DashboardLayout: React.FC = ({ children }) => {
    return (
        <StyledDashboard>
            <Header />
            <StyledSideModal>SIDE MODAL</StyledSideModal>
            {children ? children : <Outlet />}
        </StyledDashboard>
    );
};
