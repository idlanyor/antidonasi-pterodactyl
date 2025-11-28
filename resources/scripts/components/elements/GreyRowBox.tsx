import styled, { css, keyframes } from 'styled-components/macro';
import tw from 'twin.macro';

const floatAnim = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
`;

export default styled.div<{ $hoverable?: boolean; $variant?: 'default' | 'glass'; $animated?: boolean }>`
    ${tw`flex rounded-lg no-underline items-center p-4 transition-all duration-200 overflow-hidden`};
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(245, 133, 41, 0.4);
    color: #2d3748;
    box-shadow: 0 4px 15px rgba(245, 133, 41, 0.25), 0 2px 8px rgba(221, 42, 123, 0.2);
    will-change: transform, box-shadow, background-image, border-color;

    ${(props) =>
        props.$hoverable !== false &&
        css`
            &:hover {
                border-color: rgba(245, 133, 41, 0.7);
                box-shadow: 0 6px 20px rgba(245, 133, 41, 0.35), 0 3px 12px rgba(221, 42, 123, 0.25);
                transform: translateY(-2px);
            }
        `};

    & .icon {
        ${tw`rounded-full w-16 flex items-center justify-center p-3`};
        background: linear-gradient(135deg, rgba(245, 133, 41, 0.2), rgba(221, 42, 123, 0.15));
        color: #f58529;
        border: 2px solid rgba(245, 133, 41, 0.3);
    }

    ${(props) =>
        props.$variant === 'glass' &&
        css`
            ${tw`bg-white/10 border-white/20 text-neutral-100 backdrop-blur-md`};
            background-image: linear-gradient(
                135deg,
                var(--card-grad-start, rgba(245, 133, 41, 0.12)),
                var(--card-grad-end, rgba(129, 52, 175, 0.1))
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
                    var(--card-grad-start, rgba(245, 133, 41, 0.25)),
                    var(--card-grad-end, rgba(129, 52, 175, 0.2))
                );
            }
        `};

    ${(props) =>
        props.$animated &&
        css`
            animation: ${floatAnim} 7s ease-in-out infinite;
        `};
`;
