import styled, { css, keyframes } from 'styled-components/macro';
import tw from 'twin.macro';

const floatAnim = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
`;

export default styled.div<{ $hoverable?: boolean; $variant?: 'default' | 'glass'; $animated?: boolean }>`
    ${tw`flex rounded-xl no-underline items-center p-4 transition-all duration-300 overflow-hidden`};
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    color: #0f172a;
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);

    ${(props) =>
        props.$hoverable !== false &&
        css`
            &:hover {
                border-color: #cbd5e1;
                transform: translateY(-2px);
                box-shadow: 0 -12px 36px 0 rgba(15, 23, 42, 0.12);
            }
        `};

    & .icon {
        ${tw`rounded-xl w-12 h-12 flex items-center justify-center p-3`};
        background: #f1f5f9;
        color: #7c3aed;
        border: 1px solid #e2e8f0;
    }

    ${(props) =>
        props.$variant === 'glass' &&
        css`
            background-color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
        `};

    ${(props) =>
        props.$animated &&
        css`
            animation: ${floatAnim} 7s ease-in-out infinite;
        `};
`;
