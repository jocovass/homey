import { css } from '@emotion/react';
// a6bdbb
export const theme = {
    colors: {
        greenLighter: '#EEF4F4',
        greenLight: '#dce7e6',
        greenAccent: '#6CB2B2',
        greenGrey: '#A6BDBB',
        greenBlack: '#052425',
        greenDark: '#3F595B',
        yellow: '#ffbc00',
        orange: '#FB9119',
        orangeRed: '#C05E3D',
        blue: '#6398DE',
        black: '#333333',
        grey: '#999999',
        greyLight: '#efefef',
    },
    fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
        lora: ['Lora', 'serif'],
    },
    mq: {
        laptop: 'only screen and (min-width: 87.5em)', // 1400px
        'tablet-land': 'only screen and (min-width: 62.5em)', // 1000px
        tablet: 'only screen and (min-width: 50em)', // 800px
        mobile: 'only screen and (min-width: 34.5em)', // 550px
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
        --clr-green-lighter: ${theme.colors.greenLighter};
        --clr-green-light: ${theme.colors.greenLight};
        --clr-green-accent: ${theme.colors.greenAccent};
        --clr-green-grey: ${theme.colors.greenGrey};
        --clr-green-dark: ${theme.colors.greenDark};
        --clr-green-black: ${theme.colors.greenBlack};
        --clr-yellow: ${theme.colors.yellow};
        --clr-orange: ${theme.colors.orange};
        --clr-orange-red: ${theme.colors.orangeRed};
        --clr-blue: ${theme.colors.blue};
        --clr-black: ${theme.colors.black};
        --clr-grey: ${theme.colors.grey};
        --clr-grey-light: ${theme.colors.greyLight};
        // @media ${theme.mq.laptop} {
        //     font-size: 56.25%; black: '#040404',
        /* grey: '#777777',
        greyLight: '#efefef', */
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
        background-color: ${theme.colors.greenLighter};
        color: ${theme.colors.greenDark};
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: ${theme.fontFamily.playfair};
        color: ${theme.colors.greenBlack};
    }

    h1 {
        font-size: 2.45rem;
        font-weight: 500;
        margin-bottom: 0.6rem;
    }

    h3 {
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 0.6rem;
    }

    button {
        background: none;
        cursor: pointer;
        border: none;
        outline: none;
        font-family: ${theme.fontFamily.lora};
        padding: 0.3rem;

        &:focus-visible {
            outline-color: ${theme.colors.greenAccent};
            outline-width: 2px;
            outline-style: solid;
        }
    }

    ///////////////////////////////
    // global mixins
    @mixin hover {
        transition-property: box-shadow;
        transition-duration: 300ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

        &:hover,
        &:focus,
        &:focus-visible {
            box-shadow: 0 0 0 0.1em ${theme.colors.greenLighter},
                0 0 0 0.2em ${theme.colors.greenAccent};
            outline: 0;
        }
    }
`;

type Colours = keyof typeof theme.colors;
export const hoverEffect = (innerColour: Colours, outerColour: Colours) => css`
    transition-property: box-shadow;
    transition-duration: 300ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    &:hover,
    &:focus,
    &:focus-visible {
        box-shadow: 0 0 0 0.1em ${theme.colors[innerColour]},
            0 0 0 0.2em ${theme.colors[outerColour]};
        outline: 0;
    }
`;
