import React from 'react';
import styled from '@emotion/styled';
import { rgba } from 'emotion-rgba';
import { RiPencilLine, RiDeleteBin6Line } from 'react-icons/ri';

import { ListItemForm } from './ListItemForm';
import {
    ShoppingListItem,
    ShoppingListFormFields,
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

    &.done {
        .list__item-name,
        .list__item-amount {
            color: ${props => props.theme.colors.grey};
            text-decoration: line-through;
        }

        .list__item-indicator {
            background-color: ${props => props.theme.colors.orange};
            box-shadow: 0 0 0 0.1em #fff,
                0 0 0 0.2em ${props => props.theme.colors.orange};
        }
    }

    .list {
        &__item-indicator {
            display: inline-block;
            width: 0.8rem;
            height: 0.8rem;
            margin-right: 1rem;
            border-radius: 50%;
            background-color: transparent;
            box-shadow: 0 0 0 0.1em ${props => props.theme.colors.black};
        }

        &__item-name {
            font-size: 1.65rem;
        }

        &__item-amount {
            margin-left: 1.5rem;
        }

        &__item-settings {
            margin-left: auto;

            .edit,
            .delete {
                color: ${props => props.theme.colors.grey};
                padding: 0.2em;
                transition-property: color;
                transition-duration: 300ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

                &:first-of-type {
                    margin-right: 0.25rem;
                }

                &:hover {
                    color: ${props => props.theme.colors.greenDark};
                }
            }
        }
    }
`;

type ListItemProps = {
    item: ShoppingListItem;
    toggleHandler: (itemId: number) => void;
    removeHandler: (itemId: number) => void;
    updateItem: (item: ShoppingListItem) => void;
};

export const ListItem: React.FC<ListItemProps> = ({
    item,
    updateItem,
    toggleHandler,
    removeHandler,
}) => {
    const [editing, setEditing] = React.useState(false);

    const submitHandler = (data: ShoppingListFormFields) => {
        updateItem({
            ...item,
            label: data.label,
            amount: data.amount,
            unit: data.unit,
        });

        setEditing(prev => !prev);
    };

    const cancel = () => setEditing(prev => !prev);

    return (
        <StyledListItem key={item.id} className={`list__item ${item.status}`}>
            {!editing ? (
                <>
                    <button onClick={() => toggleHandler(item.id)}>
                        <span className="list__item-indicator"></span>
                        <span className="list__item-name">{item.label}</span>
                        <span className="list__item-amount">
                            {item.amount} {item.unit}
                        </span>
                    </button>
                    <div className="list__item-settings">
                        {item.status === 'done' ? (
                            <button
                                className="delete"
                                title="Delete shopping list item"
                                onClick={() => removeHandler(item.id)}
                            >
                                <RiDeleteBin6Line />
                            </button>
                        ) : (
                            <button
                                className="edit"
                                title="Edit shopping list item"
                                onClick={() => setEditing(!editing)}
                            >
                                <RiPencilLine />
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <ListItemForm
                    item={item}
                    cancel={cancel}
                    submitHandler={submitHandler}
                />
            )}
        </StyledListItem>
    );
};
