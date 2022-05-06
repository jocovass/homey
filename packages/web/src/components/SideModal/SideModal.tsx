import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { RiLogoutBoxLine } from 'react-icons/ri';

const StyledSideModal = styled.aside`
    background-color: #fff;
    position: fixed;
    top: 0;
    right: 0;
    width: 32vw;
    height: 100vh;
    max-width: 500px;
    padding: 1.5rem;

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 0.8rem;
        border-bottom: ${props => `1px solid ${props.theme.colors.greyLight}`};
    }

    .logout {
        color: ${props => props.theme.colors.grey};
        padding: 0.3rem;
        transition-property: color;
        transition-duration: 300ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

        svg {
            height: 2.2rem;
            width: 2.2rem;
        }

        &:hover {
            color: ${props => props.theme.colors.greenDark};
        }
    }

    .user {
        display: flex;
        align-items: center;
        text-decoration: none;

        &__details {
            margin-right: 0.8rem;
            text-align: right;
        }

        &__name {
            color: ${props => props.theme.colors.black};
            display: block;
            font-size: 1.4rem;
        }

        &__role {
            color: ${props => props.theme.colors.grey};
        }

        &__avatar-image {
            height: 4rem;
            width: 4rem;
            border-radius: 50%;
            overflow: hidden;
            transition-property: box-shadow;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        &:hover .user__avatar-image {
            box-shadow: 0 0 0 0.15em ${props => props.theme.colors.greenLighter},
                0 0 0 0.3em ${props => props.theme.colors.greenAccent};
            outline: 0;
        }
    }
`;

export const SideModal = () => {
    return (
        <StyledSideModal>
            <header>
                <button className="logout" aria-label="Log out" title="Lgo out">
                    <RiLogoutBoxLine />
                </button>

                <Link
                    to="/dashboard/settings"
                    className="user"
                    title="User settings"
                    aria-label="User settings button"
                >
                    <span className="user__details">
                        <span className="user__name">Jozsef Vass</span>
                        <span className="user__role">Owner</span>
                    </span>

                    <span className="user__avatar-image">
                        <svg viewBox="0 0 676 676">
                            <use href="/avatar.svg#male" />
                        </svg>
                    </span>
                </Link>
            </header>
        </StyledSideModal>
    );
};
