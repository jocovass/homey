import React from 'react';
import styled from '@emotion/styled';

import { ShoppingListCard } from '../../components/ShoppingListCard/ShoppingListCard';

const StyledShoppingLists = styled.div`
    .grid {
        margin: 3rem 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;

        > * {
            border-radius: 15px;
        }
    }
`;

export const ShoppingLists = () => {
    return (
        <StyledShoppingLists>
            <h1>Shopping Lists</h1>

            <div className="grid">
                <ShoppingListCard />
                <ShoppingListCard />
                <ShoppingListCard />
            </div>
        </StyledShoppingLists>
    );
};
