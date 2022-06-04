import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { rgba } from 'emotion-rgba';
import { RiArrowRightUpLine } from 'react-icons/ri';

import pizza from '../../images/pizza.jpeg';
import burrito from '../../images/burrito.jpeg';
import calendar from '../../images/calendar.svg';
import { ShoppingListCard } from '../../components/ShoppingListCard/ShoppingListCard';

const StyledDashboard = styled.div`
    .recipes-overview {
        margin-bottom: 5rem;

        .grid {
            margin: 3rem 0;
            display: grid;
            grid-template-columns: repeat(2, 130px) 1fr 1fr;
            grid-template-rows: minmax(50px, 100px) 1fr;
            grid-gap: 20px;

            > * {
                border-radius: 15px;
            }
        }

        .recipes-count {
            grid-column: 1 / 3;
            grid-row: 1 / 2;
            background-color: ${props => props.theme.colors.yellow};
            color: ${props => props.theme.colors.black};
            font-size: 1.4rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            strong {
                font-size: 2.5rem;
                font-weight: 600;
                margin-top: 0.5rem;
            }
        }

        .meal-planner {
            grid-column: 1 / 3;
            grid-row: 2 / 3;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            background-color: #fff;
            color: ${props => props.theme.colors.grey};
            font-size: 1.2rem;
            padding: 2rem;
            overflow: hidden;
            z-index: 1;

            p {
                margin-bottom: 0.5rem;
            }

            strong {
                display: block;
                color: ${props => props.theme.colors.black};
                font-size: 1.4rem;
            }

            .edit-meal {
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 0.2em 0.6em;
                border: 1px solid ${props => props.theme.colors.yellow};
                border-radius: 20px;
                color: ${props => props.theme.colors.yellow};
                background-color: ${props =>
                    rgba(props.theme.colors.yellow, 0.2)};
            }

            img {
                position: absolute;
                width: 16rem;
                top: 50%;
                right: 35px;
                transform: rotate(16deg) translateY(-65%);
                filter: opacity(0.35);
                z-index: -1;
            }
        }

        .recipe-one,
        .recipe-two {
            border-radius: 15px;
            position: relative;
            overflow: hidden;

            figcaption {
                position: absolute;
                border-radius: 15px;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${props =>
                    rgba(props.theme.colors.black, 0.6)};
                color: #fff;
                display: flex;
                padding: 2rem;
                align-items: flex-end;
                justify-content: space-between;
                transition-property: background-color;
                transition-duration: 300ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

                h3 {
                    color: #fff;
                }

                p {
                    font-size: 1.15rem;
                }

                a {
                    display: inline-block;
                    color: #fff;
                    background-color: ${props => props.theme.colors.yellow};
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
                        box-shadow: 0 0 0 0.1em
                                ${props => props.theme.colors.black},
                            0 0 0 0.2em ${props => props.theme.colors.yellow};
                        outline: 0;
                    }
                }

                &:hover {
                    background-color: ${props =>
                        rgba(props.theme.colors.black, 0.8)};
                }
            }

            img {
                width: 100%;
                display: block;
            }
        }

        .recipe-one {
            grid-column: 3 / 4;
            grid-row: 1 / 3;
        }

        .recipe-two {
            grid-column: 4 / 5;
            grid-row: 1 / 3;
        }
    }

    .shoppinglist-overview {
        .grid {
            margin: 3rem 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px;

            > * {
                border-radius: 15px;
            }
        }
    }
`;

export const Dashboard: React.FC = () => {
    return (
        <StyledDashboard>
            <div className="recipes-overview">
                <h2>Recipes</h2>

                <div className="grid">
                    <div className="recipes-count">
                        <p>Total Recipes</p>
                        <strong>10</strong>
                    </div>
                    <div className="meal-planner">
                        <button className="edit-meal" title="Edit meal">
                            Edit
                        </button>

                        <p>
                            Breakfast <strong>Scrambled Eggs</strong>
                        </p>
                        <p>
                            Lunch <strong>Miso soup</strong>
                        </p>
                        <p>
                            Dinner <strong>Stired Fries</strong>
                        </p>

                        <img src={calendar} alt="" />
                    </div>

                    <figure className="recipe-one">
                        <img src={pizza} alt="pizza" />
                        <figcaption>
                            <div>
                                <h3>Tomato Pizza</h3>
                                <p>1h 20m</p>
                            </div>
                            <Link
                                to="/dashboard"
                                aria-label="Go to Tomato Pizza"
                            >
                                <RiArrowRightUpLine />
                            </Link>
                        </figcaption>
                    </figure>

                    <figure className="recipe-two">
                        <img src={burrito} alt="burrito" />
                        <figcaption>
                            <div>
                                <h3>Pork Burrito</h3>
                                <p>2h 30m</p>
                            </div>
                            <Link
                                to="/dashboard"
                                aria-label="Go to Bork Burrito"
                            >
                                <RiArrowRightUpLine />
                            </Link>
                        </figcaption>
                    </figure>
                </div>
            </div>

            <div className="shoppinglist-overview">
                <h2>Shopping Lists</h2>

                <div className="grid">
                    <ShoppingListCard />
                    <ShoppingListCard />
                </div>
            </div>
        </StyledDashboard>
    );
};
