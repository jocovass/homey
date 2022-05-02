import styled from '@emotion/styled';

export const AuthForm = styled.div`
    max-width: 650px;
    padding: 0 5vw;
    margin: 1.5rem auto 0;

    .header {
        text-align: center;

        .title {
            color: ${props => props.theme.colors.greenDark};
            font-size: 2.45rem;
            font-weight: 500;
            margin-bottom: 0.6rem;
        }

        .subtitle {
            font-size: 1.4rem;
            margin-bottom: 3.5rem;
            color: ${props => props.theme.colors.greenGrey};
        }
    }

    .flex {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .or {
            font-size: 2rem;
            text-transform: uppercase;
            color: ${props => props.theme.colors.greenGrey};
        }

        .link-to-form {
            color: ${props => props.theme.colors.greenDark};
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            text-decoration: none;

            span {
                transform: translateX(0);
                transition-property: transform;
                transition-duration: 300ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            }

            svg {
                transform: scale(0) translateX(20px);
                opacity: 0;
                transition-property: transform opacity;
                transition-duration: 300ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            }

            &:hover span {
                transform: translateX(-2px);
            }

            &:hover svg {
                transform: scale(1) translateX(0px);
                opacity: 1;
            }
        }
    }

    .form-error {
        color: ${props => props.theme.colors.orangeRed};
        font-size: 1.4rem;
        margin-top: 1rem;
    }

    .forgot-password {
        margin-top: 2rem;

        a {
            color: ${props => props.theme.colors.greenGrey};
            font-size: 1.1rem;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
`;
