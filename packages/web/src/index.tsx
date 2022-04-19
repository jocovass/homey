import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.scss';
import App from './views/App';
import { ThemeProvider } from '@emotion/react';
import reportWebVitals from './reportWebVitals';
import { theme } from './styled/theme';

type AppTheme = typeof theme;
declare module '@emotion/react' {
    export interface Theme extends AppTheme {}
}

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
