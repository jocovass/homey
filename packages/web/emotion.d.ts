import '@emotion/react';

import { theme } from './src/styled/theme';

type AppTheme = typeof theme;

declare module '@emotion/react' {
    export interface Theme extends AppTheme {}
}
