import styled from '@emotion/styled';

export const StyledNav = styled.nav`
    display: flex;
    align-items: center;

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
        transition-property: color;
        transition-duration: 300ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

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
            transition-property: transform;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        &:hover,
        &.active {
            color: ${props => props.theme.colors.greenAccent};
        }

        &:hover::after,
        &.active::after {
            transform: translateX(-50%) scaleX(1);
        }

        &:focus-visible {
            outline-color: ${props => props.theme.colors.greenAccent};
        }
    }
`;
