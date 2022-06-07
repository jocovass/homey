import React from 'react';
import styled from '@emotion/styled';
import {
    RiDeleteBin6Line,
    RiAddCircleLine,
    RiGroupLine,
    RiBookMarkLine,
} from 'react-icons/ri';

import { ListItem } from './ListItem';
import { NewListItem } from './NewListItem';
import { ShoppingListItem, ShoppingListItems } from './ShoppingListTypes.d';

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
            margin-bottom: 3rem;

            .completed-items {
                color: ${props => props.theme.colors.grey};
                font-size: 2.2rem;
                margin-left: 1rem;
            }

            .created {
                font-size: 1.15rem;
                margin-top: 0.45rem;
                color: ${props => props.theme.colors.grey};
            }

            .nav button {
                color: ${props => props.theme.colors.grey};
                padding: 0.3rem;
                transition-property: color;
                transition-duration: 300ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

                &:not(:last-of-type) {
                    margin-right: 0.5rem;
                }

                svg {
                    height: 2rem;
                    width: 2rem;
                }

                &:hover {
                    color: ${props => props.theme.colors.greenDark};
                }
            }
        }
    }
`;

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
    const [newItem, setNewItem] = React.useState<boolean>(false);

    const toggleNewItem = () => setNewItem(false);

    const updateItems = (items: ShoppingListItems) => {
        // TODO:  Post items to the server
        prompt('Ready to upload your changes?');
        setItems(items);
    };

    const addNewItem = (item: ShoppingListItem) => {
        if (!items) return;
        const updatedItems = [item, ...items];
        updateItems(updatedItems);
        toggleNewItem();
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

    const itemsTotalCount = items?.length;
    const itemsDoneCount = items?.reduce((acc, item) => {
        if (item.status === 'done') {
            acc += 1;
        }

        return acc;
    }, 0);

    return (
        <StyledShoppingList>
            <h1>Shopping List</h1>

            <div className="content">
                <div className="headline">
                    <div>
                        <h3>
                            Groceries{' '}
                            <span className="completed-items">
                                {itemsDoneCount}/{itemsTotalCount}
                            </span>
                        </h3>
                        <p className="created">Created: 07.06.2022</p>
                    </div>

                    <div className="nav">
                        <button
                            title="Add new item to shopping list"
                            onClick={() => setNewItem(true)}
                        >
                            <RiAddCircleLine />
                        </button>

                        <button title="Add recipe to shopping list">
                            <RiBookMarkLine />
                        </button>

                        <button title="Delete shopping list">
                            <RiDeleteBin6Line />
                        </button>
                    </div>
                </div>

                <ul className="list">
                    {newItem && (
                        <NewListItem
                            toggleNewItem={toggleNewItem}
                            updateItem={addNewItem}
                        />
                    )}
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
