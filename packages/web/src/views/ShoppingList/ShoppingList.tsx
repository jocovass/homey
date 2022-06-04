import React from 'react';
import styled from '@emotion/styled';
import { RiDeleteBin6Line, RiAddCircleLine, RiGroupLine } from 'react-icons/ri';

import { ListItem } from './ListItem';

const StyledShoppingList = styled.div`
    .content {
        background-color: #fff;
        border-radius: 15px;
        padding: 2rem 3.5rem;
        max-width: 600px;
        margin: 3rem auto;

        .headline {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4rem;

            .completed-items {
                color: ${props => props.theme.colors.grey};
                font-size: 2.2rem;
                margin-left: 1rem;
            }

            .author {
                display: flex;
                align-items: center;

                svg {
                    color: ${props => props.theme.colors.greenDark};
                    margin-right: 0.6rem;
                    font-size: 1.25rem;
                }
            }

            .nav button {
                color: ${props => props.theme.colors.grey};
                padding: 0.3rem;
                transition-property: color;
                transition-duration: 300ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

                &:first-of-type {
                    margin-right: 0.5rem;
                }

                svg {
                    height: 1.9rem;
                    width: 1.9rem;
                }

                &:hover {
                    color: ${props => props.theme.colors.greenDark};
                }
            }
        }
    }
`;

type ShoppingListItem = {
    label: string;
    amount: number;
    unit: string;
    status?: 'pending' | 'done';
    id: number;
};
type ShoppingListItems = ShoppingListItem[] | null;

const fakeItems: ShoppingListItems = [
    {
        label: 'Bread',
        amount: 1,
        unit: 'loaf',
        status: 'pending',
        id: 1,
    },
    {
        label: 'onion',
        amount: 0.85,
        unit: 'kg',
        status: 'pending',
        id: 2,
    },
    {
        label: 'milk',
        amount: 1,
        unit: 'l',
        status: 'done',
        id: 3,
    },
    {
        label: 'banana',
        amount: 1,
        unit: 'kg',
        status: 'done',
        id: 4,
    },
    {
        label: 'apple',
        amount: 6,
        unit: 'piece',
        status: 'pending',
        id: 5,
    },
];

export const ShoppingList = () => {
    const [items, setItems] = React.useState<ShoppingListItems>(fakeItems);

    const updateItems = (items: ShoppingListItems) => {
        // TODO:  Post items to the server
        prompt('Ready to upload your changes?');
        setItems(items);
    };

    const updateItem = (item: ShoppingListItem) => {
        if (!items) return;

        const updatedItems = items.map(stateItem => {
            if (stateItem.id === item.id) {
                return {
                    ...stateItem,
                    ...item,
                };
            }
            return stateItem;
        });

        updateItems(updatedItems);
    };

    const toggleHandler = (itemId: number) => {
        if (!items) return;
        const updatedItems = items.map(item => {
            if (item.id === itemId) {
                item.status = item.status === 'done' ? 'pending' : 'done';
            }

            return item;
        });

        updateItems(updatedItems);
    };

    const removeHandler = (itemId: number) => {
        if (!items) return;

        const updatedItems = items.filter(item => item.id !== itemId);

        updateItems(updatedItems);
    };

    return (
        <StyledShoppingList>
            <h1>Shopping List</h1>

            <div className="content">
                <div className="headline">
                    <div>
                        <h3>
                            Groceries{' '}
                            <span className="completed-items">2/10</span>
                        </h3>
                        <p className="author">
                            <RiGroupLine />
                            <span>Nora Sorban</span>
                            <span>, Joco Vass</span>
                        </p>
                    </div>

                    <div className="nav">
                        <button title="Add recipe to shopping list">
                            <RiAddCircleLine />
                        </button>

                        <button title="Delete shopping list">
                            <RiDeleteBin6Line />
                        </button>
                    </div>
                </div>

                <ul className="list">
                    {items &&
                        items.map(item => (
                            <ListItem
                                key={item.id}
                                item={item}
                                updateItem={updateItem}
                                toggleHandler={toggleHandler}
                                removeHandler={removeHandler}
                            />
                        ))}
                </ul>
            </div>
        </StyledShoppingList>
    );
};
