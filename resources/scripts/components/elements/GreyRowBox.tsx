import styled, { css, keyframes } from 'styled-components/macro';
import tw from 'twin.macro';

const floatAnim = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
`;

export default styled.div<{ $hoverable?: boolean; $variant?: 'default' | 'glass'; $animated?: boolean }>`
    ${tw`flex rounded no-underline text-neutral-200 items-center bg-neutral-700 p-4 border border-transparent transition-all duration-200 overflow-hidden`};
    will-change: transform, box-shadow, background-image, border-color;

    ${(props) => props.$hoverable !== false && tw`hover:border-neutral-500`};

    & .icon {
        ${tw`rounded-full w-16 flex items-center justify-center bg-neutral-500 p-3`};
    }

    ${(props) =>
        props.$variant === 'glass' &&
        css`
            ${tw`bg-white/10 border-white/20 text-neutral-100 backdrop-blur-md`};
            background-image: linear-gradient(
                135deg,
                var(--card-grad-start, rgba(59, 130, 246, 0.12)),
                var(--card-grad-end, rgba(16, 185, 129, 0.1))
            );
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;

            &:hover {
                ${tw`border-white/30`};
                transform: translateY(-2px);
                box-shadow: 0 14px 32px rgba(0, 0, 0, 0.22);
            }

            &:active {
                transform: translateY(0);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
            }

            & .icon {
                ${tw`bg-white/10`};
                background-image: linear-gradient(
                    135deg,
                    var(--card-grad-start, rgba(59, 130, 246, 0.25)),
                    var(--card-grad-end, rgba(16, 185, 129, 0.2))
                );
            }
        `};

    ${(props) =>
        props.$animated &&
        css`
            animation: ${floatAnim} 7s ease-in-out infinite;
        `};
`;
