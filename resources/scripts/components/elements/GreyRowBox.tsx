import styled, { css, keyframes } from 'styled-components/macro';
import tw from 'twin.macro';

const floatAnim = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
`;

export default styled.div<{ $hoverable?: boolean; $variant?: 'default' | 'glass'; $animated?: boolean }>`
    ${tw`flex rounded-lg no-underline items-center p-4 transition-all duration-200 overflow-hidden`};
    background: #111827;
    border: 1px solid #1f2937;
    color: #e5e7eb;
    box-shadow: none;
    will-change: transform, box-shadow, background-image, border-color;

    ${(props) =>
        props.$hoverable !== false &&
        css`
            &:hover {
                border-color: #374151;
                box-shadow: none;
                transform: translateY(-1px);
            }
        `};

    & .icon {
        ${tw`rounded-full w-16 flex items-center justify-center p-3`};
        background: #0f172a;
        color: #60a5fa;
        border: 1px solid #1f2937;
    }

    ${(props) =>
        props.$variant === 'glass' &&
        css`
            ${tw`bg-white/10 border-white/20 text-neutral-100 backdrop-blur-md`};
            background-image: none;
            box-shadow: none;
            transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;

            &:hover {
                ${tw`border-white/30`};
                transform: translateY(-1px);
                box-shadow: none;
            }

            &:active {
                transform: translateY(0);
                box-shadow: none;
            }

            & .icon {
                ${tw`bg-white/10`};
                background-image: none;
            }
        `};

    ${(props) =>
        props.$animated &&
        css`
            animation: ${floatAnim} 7s ease-in-out infinite;
        `};
`;
