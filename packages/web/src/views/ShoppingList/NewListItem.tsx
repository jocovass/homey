import React from 'react';
import styled from '@emotion/styled';
import { rgba } from 'emotion-rgba';

import { ListItemForm } from './ListItemForm';
import {
    ShoppingListFormFields,
    ShoppingListItem,
} from './ShoppingListTypes.d';

const StyledListItem = styled.li`
    list-style-type: none;
    font-size: 1.4rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    padding: 1.5rem;
    border-radius: 5px;
    width: 100%;
    border: 2px solid ${props => rgba(props.theme.colors.greenAccent, 0.8)};
    background-color: ${props => rgba(props.theme.colors.greenAccent, 0.1)};
`;

type NewListItemProps = {
    toggleNewItem: () => void;
    updateItem: (item: ShoppingListItem) => void;
};

export const NewListItem: React.FC<NewListItemProps> = ({
    toggleNewItem,
    updateItem,
}) => {
    const submitHandler = (data: ShoppingListFormFields) => {
        updateItem({
            id: Math.ceil(Math.random() * 1000),
            status: 'pending',
            label: data.label,
            unit: data.unit,
            amount: data.amount,
        });
        toggleNewItem();
    };

    return (
        <StyledListItem>
            <ListItemForm
                cancel={toggleNewItem}
                submitHandler={submitHandler}
                submitButtonLabel="Add to List"
            />
        </StyledListItem>
    );
};
