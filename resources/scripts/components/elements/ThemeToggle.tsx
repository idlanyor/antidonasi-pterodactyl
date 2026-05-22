import React from 'react';
import { useTheme } from '@/theme';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Tooltip from '@/components/elements/tooltip/Tooltip';

const ToggleButton = styled.button`
    ${tw`relative flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer transition-all duration-300 border-none outline-none`};
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    color: var(--text-secondary);

    &:hover {
        background-color: var(--bg-hover);
        border-color: var(--border-secondary);
        color: var(--text-primary);
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    & svg {
        ${tw`w-4 h-4 transition-transform duration-500`};
    }
`;

const SunIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={2}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
        />
    </svg>
);

const MoonIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={2}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z'
        />
    </svg>
);

const ThemeToggle: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <Tooltip placement={'bottom'} content={isDark ? 'Light Mode' : 'Dark Mode'}>
            <ToggleButton onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                {isDark ? <SunIcon /> : <MoonIcon />}
            </ToggleButton>
        </Tooltip>
    );
};

export default ThemeToggle;
