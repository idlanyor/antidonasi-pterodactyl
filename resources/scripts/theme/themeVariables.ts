/**
 * Theme CSS Custom Properties
 *
 * Defines all color tokens as CSS custom properties for light and dark themes.
 * These are applied to document.documentElement by ThemeContext.
 *
 * Naming convention:
 *   --bg-*      → background colors
 *   --text-*    → text colors
 *   --border-*  → border colors
 *   --shadow-*  → box-shadow values
 *   --nav-*     → navigation-specific
 *   --sidebar-* → sidebar-specific
 *   --modal-*   → modal-specific
 *   --accent-*  → accent/brand colors (mostly shared)
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeVariables {
    [key: string]: string;
}

// ─── Accent Colors ──────────────────────────────────────────
// Default accent is the original Pterodactyl violet. Users can pick
// another preset (or any custom color) which overrides --accent and
// --accent-rgb on :root via ThemeContext.

export const DEFAULT_ACCENT = '#7C3AED';

export interface AccentPreset {
    name: string;
    color: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
    { name: 'Violet', color: '#7C3AED' },
    { name: 'Blue', color: '#2299DD' },
    { name: 'Cyan', color: '#06B6D4' },
    { name: 'Green', color: '#10B981' },
    { name: 'Lime', color: '#84CC16' },
    { name: 'Amber', color: '#F59E0B' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Red', color: '#EF4444' },
    { name: 'Pink', color: '#EC4899' },
];

/**
 * Convert a #RRGGBB hex color to a "r, g, b" string usable in rgba().
 */
export function hexToRgbString(hex: string): string {
    const h = hex.replace('#', '');
    const full =
        h.length === 3
            ? h
                  .split('')
                  .map((c) => c + c)
                  .join('')
            : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 0xff;
    const g = (n >> 8) & 0xff;
    const b = n & 0xff;
    return `${r}, ${g}, ${b}`;
}

// ─── Light Theme ─────────────────────────────────────────────
export const lightTheme: ThemeVariables = {
    // Backgrounds
    '--bg-primary': '#F8FAFC',
    '--bg-secondary': '#FFFFFF',
    '--bg-tertiary': '#F1F5F9',
    '--bg-elevated': '#FFFFFF',
    '--bg-input': '#FFFFFF',
    '--bg-hover': '#F8FAFC',
    '--bg-active': 'rgba(var(--accent-rgb), 0.08)',
    '--bg-code': '#F1F5F9',
    '--bg-tooltip': '#0F172A',
    '--bg-progress-track': '#F1F5F9',

    // Text
    '--text-primary': '#0F172A',
    '--text-secondary': '#64748B',
    '--text-muted': '#A3A3A3',
    '--text-inverse': '#FFFFFF',
    '--text-link': '#2299DD',

    // Borders
    '--border-primary': '#E2E8F0',
    '--border-secondary': '#CBD5E1',
    '--border-input': '#E2E8F0',
    '--border-focus': 'var(--accent)',

    // Shadows
    '--shadow-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    '--shadow-md': '0 14px 30px 0 rgba(var(--accent-rgb), 0.24)',
    '--shadow-lg': '0 -10px 30px 0 rgba(15, 23, 42, 0.08)',
    '--shadow-lg-hover': '0 -12px 36px 0 rgba(15, 23, 42, 0.12)',
    '--shadow-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '--shadow-input': 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px',
    '--shadow-focus': 'rgba(var(--accent-rgb), 0.25) 0px 0px 0px 3px',
    '--shadow-btn-primary': '0 14px 30px 0 rgba(var(--accent-rgb), 0.24)',
    '--shadow-btn-primary-hover': '0 18px 36px 0 rgba(var(--accent-rgb), 0.32)',

    // Navigation
    '--nav-bg': '#FFFFFF',
    '--nav-shadow': '0 -10px 30px 0 rgba(15, 23, 42, 0.08)',
    '--nav-text': '#64748B',
    '--nav-text-hover': 'var(--accent)',
    '--nav-hover-bg': '#F8FAFC',

    // Sidebar
    '--sidebar-bg': '#FFFFFF',
    '--sidebar-border': '#E2E8F0',
    '--sidebar-text': '#64748B',
    '--sidebar-text-hover': '#0F172A',
    '--sidebar-text-active': 'var(--accent)',
    '--sidebar-hover-bg': '#F8FAFC',
    '--sidebar-active-bg': 'rgba(var(--accent-rgb), 0.08)',

    // Modal
    '--modal-overlay': 'rgba(15, 23, 42, 0.6)',
    '--modal-bg': '#FFFFFF',
    '--modal-spinner-overlay': 'rgba(255, 255, 255, 0.6)',

    // Status badges (shared — these work well in both themes)
    '--status-success-bg': '#DCFCE7',
    '--status-success-text': '#10B981',
    '--status-success-border': 'rgba(16, 185, 129, 0.2)',
    '--status-error-bg': '#FEE2E2',
    '--status-error-text': '#EF4444',
    '--status-error-border': 'rgba(239, 68, 68, 0.2)',
    '--status-warning-bg': '#FEF3C7',
    '--status-warning-text': '#F59E0B',
    '--status-warning-border': 'rgba(245, 158, 11, 0.2)',

    // Info cards
    '--info-card-bg': '#F8FAFC',
    '--info-card-border': '#E2E8F0',
    '--info-card-hover-bg': '#F1F5F9',
    '--info-card-hover-border': '#CBD5E1',

    // Checkbox
    '--checkbox-bg': '#FFFFFF',
    '--checkbox-border': '#E2E8F0',
    '--checkbox-checked-bg': 'var(--accent)',

    // Scrollbar
    '--scrollbar-thumb': '#334155',
    '--scrollbar-thumb-hover': '#475569',

    // Gradient overlays
    '--gradient-hero': 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.08) 0%, rgba(var(--accent-rgb), 0.08) 100%)',
    '--gradient-hero-border': 'rgba(var(--accent-rgb), 0.1)',
    '--gradient-hero-radial': 'radial-gradient(circle at 100% 50%, rgba(var(--accent-rgb), 0.2) 0%, transparent 70%)',

    // Filter wrapper
    '--filter-bg': '#F1F5F9',
    '--filter-border': '#E2E8F0',

    // Icon backgrounds
    '--icon-bg': '#F1F5F9',
    '--icon-border': '#E2E8F0',

    // Section dividers
    '--section-divider': '#F1F5F9',

    // Disabled states
    '--disabled-bg': '#F8FAFC',
};

// ─── Dark Theme (Navy Dark) ─────────────────────────────────
export const darkTheme: ThemeVariables = {
    // Backgrounds
    '--bg-primary': '#0B1120',
    '--bg-secondary': '#0F172A',
    '--bg-tertiary': '#1E293B',
    '--bg-elevated': '#162032',
    '--bg-input': '#1E293B',
    '--bg-hover': '#1E293B',
    '--bg-active': 'rgba(var(--accent-rgb), 0.12)',
    '--bg-code': '#1E293B',
    '--bg-tooltip': '#334155',
    '--bg-progress-track': '#1E293B',

    // Text
    '--text-primary': '#F1F5F9',
    '--text-secondary': '#94A3B8',
    '--text-muted': '#64748B',
    '--text-inverse': '#0F172A',
    '--text-link': '#38BDF8',

    // Borders
    '--border-primary': '#1E293B',
    '--border-secondary': '#334155',
    '--border-input': '#334155',
    '--border-focus': 'var(--accent)',

    // Shadows (more subtle in dark mode)
    '--shadow-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
    '--shadow-md': '0 14px 30px 0 rgba(var(--accent-rgb), 0.15)',
    '--shadow-lg': '0 -10px 30px 0 rgba(0, 0, 0, 0.3)',
    '--shadow-lg-hover': '0 -12px 36px 0 rgba(0, 0, 0, 0.4)',
    '--shadow-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '--shadow-input': 'rgba(0, 0, 0, 0.3) 0px 10px 15px -3px, rgba(0, 0, 0, 0.2) 0px 4px 6px -4px',
    '--shadow-focus': 'rgba(var(--accent-rgb), 0.35) 0px 0px 0px 3px',
    '--shadow-btn-primary': '0 14px 30px 0 rgba(var(--accent-rgb), 0.18)',
    '--shadow-btn-primary-hover': '0 18px 36px 0 rgba(var(--accent-rgb), 0.25)',

    // Navigation
    '--nav-bg': '#0F172A',
    '--nav-shadow': '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
    '--nav-text': '#94A3B8',
    '--nav-text-hover': 'var(--accent)',
    '--nav-hover-bg': '#1E293B',

    // Sidebar
    '--sidebar-bg': '#0F172A',
    '--sidebar-border': '#1E293B',
    '--sidebar-text': '#94A3B8',
    '--sidebar-text-hover': '#F1F5F9',
    '--sidebar-text-active': 'var(--accent)',
    '--sidebar-hover-bg': '#1E293B',
    '--sidebar-active-bg': 'rgba(var(--accent-rgb), 0.12)',

    // Modal
    '--modal-overlay': 'rgba(0, 0, 0, 0.7)',
    '--modal-bg': '#162032',
    '--modal-spinner-overlay': 'rgba(22, 32, 50, 0.7)',

    // Status badges (slightly adjusted for dark backgrounds)
    '--status-success-bg': 'rgba(16, 185, 129, 0.15)',
    '--status-success-text': '#34D399',
    '--status-success-border': 'rgba(16, 185, 129, 0.25)',
    '--status-error-bg': 'rgba(239, 68, 68, 0.15)',
    '--status-error-text': '#F87171',
    '--status-error-border': 'rgba(239, 68, 68, 0.25)',
    '--status-warning-bg': 'rgba(245, 158, 11, 0.15)',
    '--status-warning-text': '#FBBF24',
    '--status-warning-border': 'rgba(245, 158, 11, 0.25)',

    // Info cards
    '--info-card-bg': '#1E293B',
    '--info-card-border': '#334155',
    '--info-card-hover-bg': '#263549',
    '--info-card-hover-border': '#475569',

    // Checkbox
    '--checkbox-bg': '#1E293B',
    '--checkbox-border': '#334155',
    '--checkbox-checked-bg': 'var(--accent)',

    // Scrollbar
    '--scrollbar-thumb': '#475569',
    '--scrollbar-thumb-hover': '#64748B',

    // Gradient overlays
    '--gradient-hero': 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.12) 0%, rgba(var(--accent-rgb), 0.12) 100%)',
    '--gradient-hero-border': 'rgba(var(--accent-rgb), 0.2)',
    '--gradient-hero-radial': 'radial-gradient(circle at 100% 50%, rgba(var(--accent-rgb), 0.15) 0%, transparent 70%)',

    // Filter wrapper
    '--filter-bg': '#1E293B',
    '--filter-border': '#334155',

    // Icon backgrounds
    '--icon-bg': '#1E293B',
    '--icon-border': '#334155',

    // Section dividers
    '--section-divider': '#1E293B',

    // Disabled states
    '--disabled-bg': '#1E293B',
};
