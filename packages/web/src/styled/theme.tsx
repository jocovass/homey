import { css } from '@emotion/react';

export const theme = {
    colors: {
        greenLight: '#EEF4F4',
        greenAccent: '#6CB2B2',
        greenGrey: '#A6BDBB',
        greenBlack: '#052425',
        greenDark: '#3F595B',
        orange: '#FB9119',
        orangeRed: '#C05E3D',
        blue: '#6398DE',
    },
    fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
        lora: ['Lora', 'serif'],
    },
    mq: {
        laptop: 'only screen and (max-width: 87.5em)', // 1400px
        'tablet-land': 'only screen and (max-width: 62.5em)', // 1000px
        tablet: 'only screen and (max-width: 50em)', // 800px
        mobile: 'only screen and (max-width: 34.5em)', // 550px
    },
};

export const globalStyles = css`
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
        // @media ${theme.mq.laptop} {
        //     font-size: 56.25%;
        // }
        // @media ${theme.mq['tablet-land']} {
        //     font-size: 50%;
        // }
        // @media ${theme.mq.mobile} {
        //     font-size: 43.5%;
        // }
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
        color: ${theme.colors.blue};
    }

    button {
        background: none;
        cursor: pointer;
        border: none;
        outline: none;
        font-family: 'Merriweather', sans-serif;
    }
`;
