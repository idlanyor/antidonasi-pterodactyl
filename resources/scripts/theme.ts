import { BreakpointFunction, createBreakpoint } from 'styled-components-breakpoint';

type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export const breakpoint: BreakpointFunction<Breakpoints> = createBreakpoint<Breakpoints>({
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
});

// Re-export theme utilities from the theme/ directory
export { ThemeProvider, useTheme } from './theme/ThemeContext';
export { lightTheme, darkTheme, ACCENT_PRESETS, DEFAULT_ACCENT, hexToRgbString } from './theme/themeVariables';
export type { ThemeMode, ThemeVariables, AccentPreset } from './theme/themeVariables';
