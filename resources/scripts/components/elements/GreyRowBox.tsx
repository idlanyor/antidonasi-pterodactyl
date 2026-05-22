import styled, { css, keyframes } from 'styled-components/macro';
import tw from 'twin.macro';

const floatAnim = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
`;

export default styled.div<{ $hoverable?: boolean; $variant?: 'default' | 'glass'; $animated?: boolean }>`
    ${tw`flex rounded-xl no-underline items-center p-4 transition-all duration-300 overflow-hidden`};
    background-color: var(--bg-elevated);
    border: 1px solid var(--border-primary);
    color: var(--text-primary);
    box-shadow: var(--shadow-lg);

    ${(props) =>
        props.$hoverable !== false &&
        css`
            &:hover {
                border-color: var(--border-secondary);
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg-hover);
            }
        `};

    & .icon {
        ${tw`rounded-xl w-12 h-12 flex items-center justify-center p-3`};
        background: var(--icon-bg);
        color: #7c3aed;
        border: 1px solid var(--icon-border);
    }

    ${(props) =>
        props.$variant === 'glass' &&
        css`
            background-color: var(--bg-elevated);
            backdrop-filter: blur(8px);
        `};

    ${(props) =>
        props.$animated &&
        css`
            animation: ${floatAnim} 7s ease-in-out infinite;
        `};
`;
