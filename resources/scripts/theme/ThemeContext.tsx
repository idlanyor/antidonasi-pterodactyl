import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ThemeMode, lightTheme, darkTheme, ThemeVariables } from '@/theme/themeVariables';

const STORAGE_KEY = 'pterodactyl:theme';

interface ThemeContextValue {
    theme: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    isDark: true,
    toggleTheme: () => {},
    setTheme: () => {},
});

/**
 * Apply CSS custom properties from a theme variables object to `document.documentElement`.
 */
function applyThemeVariables(variables: ThemeVariables): void {
    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

/**
 * Get the initial theme from localStorage, defaulting to 'dark'.
 */
function getInitialTheme(): ThemeMode {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
    } catch {
        // localStorage not available (SSR, private browsing, etc.)
    }
    // Default to dark mode as per user preference
    return 'dark';
}

export const ThemeProvider: React.FC = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

    const applyTheme = useCallback((mode: ThemeMode) => {
        const variables = mode === 'dark' ? darkTheme : lightTheme;
        applyThemeVariables(variables);

        // Toggle class on documentElement for Tailwind dark: prefix support
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Apply on mount and when theme changes
    useEffect(() => {
        applyTheme(theme);

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Silently fail if localStorage is unavailable
        }
    }, [theme, applyTheme]);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeState(mode);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to access the current theme state and toggle function.
 *
 * @example
 * const { isDark, toggleTheme } = useTheme();
 */
export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
