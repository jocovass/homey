import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { RiGroupLine, RiArrowRightUpLine } from 'react-icons/ri';

const StyledShoppingListCard = styled.div`
    background-color: #fff;
    padding: 2rem;
    position: relative;

    .author,
    .item-count {
        color: ${props => props.theme.colors.grey};
        font-size: 1.3rem;
    }

    .author {
        display: flex;
        align-items: center;

        svg {
            color: ${props => props.theme.colors.greenDark};
            margin-right: 0.6rem;
            font-size: 1.6rem;
        }
    }

    h3 {
        color: ${props => props.theme.colors.black};
        margin: 3rem 0 2rem;
    }

    a {
        position: absolute;
        bottom: 15px;
        right: 15px;
        display: inline-block;
        color: #fff;
        background-color: ${props => props.theme.colors.greenDark};
        height: 3rem;
        width: 3rem;
        font-size: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition-property: box-shadow;
        transition-duration: 300ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

        &:hover,
        &:focus,
        &:focus-visible {
            box-shadow: 0 0 0 0.1em #fff,
                0 0 0 0.2em ${props => props.theme.colors.greenDark};
            outline: 0;
        }
    }
`;

export const ShoppingListCard = () => {
    return (
        <StyledShoppingListCard>
            <p className="item-count">5 items</p>
            <h3>Groceries</h3>
            <p className="author">
                <RiGroupLine />
                <span>Nora Sorban</span>
                <span>, Joco Vass</span>
            </p>
            <Link
                to="/dashboard/shoppinglists/some-id"
                aria-label="Go to Tomato Pizza"
            >
                <RiArrowRightUpLine />
            </Link>
        </StyledShoppingListCard>
    );
};
