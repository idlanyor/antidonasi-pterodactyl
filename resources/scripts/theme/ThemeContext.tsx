import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    ThemeMode,
    lightTheme,
    darkTheme,
    ThemeVariables,
    DEFAULT_ACCENT,
    hexToRgbString,
} from '@/theme/themeVariables';

const STORAGE_KEY = 'pterodactyl:theme';
const ACCENT_STORAGE_KEY = 'pterodactyl:accent';

interface ThemeContextValue {
    theme: ThemeMode;
    isDark: boolean;
    accent: string;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
    setAccent: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    isDark: true,
    accent: DEFAULT_ACCENT,
    toggleTheme: () => {},
    setTheme: () => {},
    setAccent: () => {},
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
 * Set the accent color (+ its RGB triplet) on the root element.
 */
function applyAccent(accent: string): void {
    const root = document.documentElement;
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-rgb', hexToRgbString(accent));
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

/**
 * Get the initial accent from localStorage, defaulting to the Pterodactyl violet.
 */
function getInitialAccent(): string {
    try {
        const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
        if (stored && /^#[0-9a-fA-F]{6}$/.test(stored)) {
            return stored;
        }
    } catch {
        // localStorage not available
    }
    return DEFAULT_ACCENT;
}

export const ThemeProvider: React.FC = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
    const [accent, setAccentState] = useState<string>(getInitialAccent);

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
        applyAccent(accent);

        try {
            localStorage.setItem(STORAGE_KEY, theme);
            localStorage.setItem(ACCENT_STORAGE_KEY, accent);
        } catch {
            // Silently fail if localStorage is unavailable
        }
    }, [theme, accent, applyTheme]);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeState(mode);
    }, []);

    const setAccent = useCallback((color: string) => {
        setAccentState(color);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', accent, toggleTheme, setTheme, setAccent }}>
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
