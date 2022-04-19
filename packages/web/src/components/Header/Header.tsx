import { Link, NavLink } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledHeader = styled.header`
    padding: 1.5rem 5vw;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
        height: 4.5rem;
        width: 4.5rem;
        border-radius: 50%;
        background-image: linear-gradient(
            to right,
            #fff 0%,
            #fff 50%,
            #000 50%
        );
        position: relative;
        font-size: 3.3rem;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
            color: #fff;
            mix-blend-mode: exclusion;
        }
    }

    nav {
        display: flex;
        align-items: center;
    }

    ul {
        display: flex;
        align-items: center;
        list-style: none;
    }

    li:not(:last-of-type) {
        margin-right: 2rem;
    }

    li a {
        display: inline-block;
        font-size: 1.6rem;
        font-weight: 600;
        color: ${props => props.theme.colors.greenDark};
        text-decoration: none;
        position: relative;
        padding: 0.4em;
        transition: color 0.2s ease-in-out;

        &::after {
            content: '';
            position: absolute;
            bottom: 0px;
            left: 50%;
            height: 3px;
            width: 17px;
            background-color: ${props => props.theme.colors.greenAccent};
            transform-origin: center;
            transform: translateX(-50%) scaleX(0);
            transition: transform 0.2s ease-in-out;
        }

        &:hover,
        &.active {
            color: ${props => props.theme.colors.greenAccent};
        }

        &:hover::after,
        &.active::after {
            transform: translateX(-50%) scaleX(1);
        }
    }
`;

const PrimaryButton = styled(Link)(
    props => `
    text-decoration: none;
    color: ${props.theme.colors.greenDark};
    border: .125em solid ${props.theme.colors.greenDark};
    border-radius: 100px;
    font-size: 1.5rem;
    font-weight: 600;
    padding: .25em 1em;
    margin-left: 2rem;

    box-shadow: inset 0 0 0.2em 0 ${props.theme.colors.greenDark}, 0 0 0.2em 0 ${props.theme.colors.greenDark};
    transition: background .2s ease-in-out, color .2s ease-in-out;

    &:hover {
        background-color: ${props.theme.colors.greenDark};
        color: ${props.theme.colors.greenLight};
    }
`,
);

export const Header = () => {
    return (
        <StyledHeader>
            <div className="logo">
                <span>Y</span>
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                            to="/"
                        >
                            Home
                        </NavLink>
                    </li>
                </ul>
                <PrimaryButton to="/login">Login</PrimaryButton>
            </nav>
        </StyledHeader>
    );
};
