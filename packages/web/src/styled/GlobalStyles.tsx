import { css, Global, Theme, withTheme } from '@emotion/react';
import React from 'react';
import { theme } from './theme';

type AppTheme = typeof theme & Theme;

const mageGlobalStyles = (theme: AppTheme) => css`
    *,
    *::before,
    *::after {
        box-sizing: inherit;
        padding: 0;
        margin: 0;
    }
    html {
        font-size: 62.5%; // set the root fontsize to 10px
        --clr-greenLight: ${theme.colors.greenLight};
        --clr-greenAccent: ${theme.colors.greenAccent};
        --clr-greenGrey: ${theme.colors.greenGrey};
        --clr-greenDark: ${theme.colors.greenDark};
        --clr-greenBlack: ${theme.colors.greenBlack};
        --clr-orange: ${theme.colors.orange};
        --clr-orangeRed: ${theme.colors.orangeRed};
        --clr-blue: ${theme.colors.blue};
        @media ${theme.mq.laptop} {
            font-size: 56.25%;
        }
        @media ${theme.mq['tablet-land']} {
            font-size: 50%;
        }
        @media ${theme.mq.mobile} {
            font-size: 43.5%;
        }
    }
    body {
        font-family: ${theme.fontFamily.lora};
        background-color: ${theme.colors.greenLight};
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: ${theme.fontFamily.playfair};
    }

    button {
        background: none;
        cursor: pointer;
        border: none;
        outline: none;
        font-family: 'Merriweather', sans-serif;
    }
`;

const GlobalStyles = withTheme(({ theme }) => {
    return <Global styles={mageGlobalStyles(theme)} />;
});
