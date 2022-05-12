import React from 'react';
import styled from '@emotion/styled';
import { RiSendPlaneFill } from 'react-icons/ri';

const StyledMembers = styled.div`
    header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4rem;
    }

    .add-member {
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 0.6em 1.2em;
        border-radius: 5px;
        font-size: 1.2rem;
        transition-property: box-shadow, background;
        transition-duration: 300ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

        svg {
            margin-left: 0.5rem;
        }

        &:hover,
        &:focus,
        &:focus-visible {
            background-color: ${props => props.theme.colors.yellow};
            box-shadow: 0 0 0 0.15em ${props => props.theme.colors.greenLight},
                0 0 0 0.3em ${props => props.theme.colors.yellow};
            outline: 0;
        }
    }

    .member {
        background-color: #fff;
        padding: 0.7rem clamp(1rem, 5vw, 1.5rem);
        margin-bottom: 1.5rem;
        border-radius: 5px;
        display: flex;
        align-items: center;

        &__avatar {
            height: 3.7rem;
            width: 3.7rem;
            margin-right: 1rem;
            border-radius: 50%;
            overflow: hidden;

            svg {
                width: 100%;
            }
        }

        &__name {
            font-size: 1.4rem;
            color: ${props => props.theme.colors.black};
        }

        &__role {
            font-size: 1.15rem;
            color: ${props => props.theme.colors.grey};
        }

        &__date {
            margin-left: auto;
            background-color: ${props => props.theme.colors.yellow};
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 1.05rem;
            color: ${props => props.theme.colors.greenBlack};
        }
    }
`;

export const Members: React.FC = () => {
    return (
        <StyledMembers>
            <header>
                <h1>Household members</h1>

                <button className="add-member">
                    Send invitation
                    <RiSendPlaneFill />
                </button>
            </header>

            <div className="members-list">
                {[1, 2, 3, 4].map(item => {
                    return (
                        <div className="member" key={item}>
                            <div className="member__avatar">
                                <svg viewBox="0 0 676 676">
                                    <use href="/avatar.svg#male" />
                                </svg>
                            </div>

                            <div className="member__info">
                                <p className="member__name">
                                    Firstname Lastname
                                </p>
                                <p className="member__role">Role</p>
                            </div>

                            <span className="member__date">2022.05.12</span>
                        </div>
                    );
                })}
            </div>
        </StyledMembers>
    );
};
