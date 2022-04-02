module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
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
                playfair: ['Playfair Display', 'serif'],
                ubuntu: ['Ubuntu', 'sans-serif'],
                lora: ['Lora', 'serif'],
            },
        },
    },
    plugins: [],
};
