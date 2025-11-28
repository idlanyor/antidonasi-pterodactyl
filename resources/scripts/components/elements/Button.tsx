import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';

interface Props {
    isLoading?: boolean;
    size?: 'xsmall' | 'small' | 'large' | 'xlarge';
    color?: 'green' | 'red' | 'primary' | 'grey';
    isSecondary?: boolean;
    variant?: 'default' | 'glass';
    shape?: 'default' | 'oval';
    palette?: 'purpleRed' | 'indigoPink' | 'cyanBlue' | 'sunset' | 'rainbow' | 'instagram';
}

const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    ${tw`relative inline-block rounded-lg p-2 tracking-wide text-sm transition-all duration-200 border shadow-sm`};

    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css<Props>`
            ${tw`text-white border-transparent shadow-md`};
            background: linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%);

            &:hover:not(:disabled) {
                filter: brightness(1.1);
                ${tw`shadow-lg`};
            }
        `};

    ${(props) =>
        props.color === 'grey' &&
        css`
            ${tw`bg-gradient-to-br from-neutral-400 to-neutral-600 border-neutral-700 text-white shadow-md`};

            &:hover:not(:disabled) {
                ${tw`bg-gradient-to-br from-neutral-500 to-neutral-700 border-neutral-800 shadow-lg`};
            }
        `};

    ${(props) =>
        props.color === 'green' &&
        css<Props>`
            ${tw`bg-gradient-to-br from-green-400 to-green-600 border-green-700 text-white shadow-md`};

            &:hover:not(:disabled) {
                ${tw`bg-gradient-to-br from-green-500 to-green-700 border-green-800 shadow-lg`};
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        ${tw`bg-green-600 border-green-700`};
                    }
                `};
        `};

    ${(props) =>
        props.color === 'red' &&
        css<Props>`
            ${tw`bg-gradient-to-br from-red-400 to-red-600 border-red-700 text-white shadow-md`};

            &:hover:not(:disabled) {
                ${tw`bg-gradient-to-br from-red-500 to-red-700 border-red-800 shadow-lg`};
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        ${tw`bg-red-600 border-red-700`};
                    }
                `};
        `};

    ${(props) => props.size === 'xsmall' && tw`px-3 py-1.5 text-xs rounded-md`};
    ${(props) => (!props.size || props.size === 'small') && tw`px-5 py-2.5 rounded-md`};
    ${(props) => props.size === 'large' && tw`px-6 py-3 text-base rounded-lg`};
    ${(props) => props.size === 'xlarge' && tw`px-6 py-3 w-full text-base rounded-lg`};
    ${(props) => props.shape === 'oval' && tw`rounded-full`};

    ${(props) =>
        props.isSecondary &&
        css<Props>`
            ${tw`text-white backdrop-blur-md`};
            background: rgba(255, 255, 255, 0.25);
            border: 2px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

            &:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.35);
                border-color: rgba(255, 255, 255, 0.7);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
                ${(props) =>
                    props.color === 'red' &&
                    css`
                        background: rgba(252, 129, 129, 0.35);
                        border-color: #fc8181;
                    `};
                ${(props) =>
                    props.color === 'primary' &&
                    css`
                        background: linear-gradient(135deg, rgba(245, 133, 41, 0.4), rgba(221, 42, 123, 0.4));
                        border-color: rgba(245, 133, 41, 0.8);
                    `};
                ${(props) =>
                    props.color === 'green' &&
                    css`
                        background: rgba(72, 187, 120, 0.35);
                        border-color: #48bb78;
                    `};
            }
        `};

    /* Glass variant overrides most color styling */
    ${(props) =>
        props.variant === 'glass' &&
        css`
            ${tw`bg-white/20 text-neutral-100 backdrop-blur-md`};
            border: 2px solid rgba(255, 255, 255, 0.5);
            background-image: linear-gradient(
                135deg,
                ${props.palette === 'indigoPink'
                    ? 'rgba(245,133,41,0.30), rgba(221,42,123,0.25)'
                    : props.palette === 'cyanBlue'
                    ? 'rgba(221,42,123,0.30), rgba(129,52,175,0.25)'
                    : props.palette === 'sunset'
                    ? 'rgba(245,133,41,0.32), rgba(221,42,123,0.25)'
                    : props.palette === 'rainbow'
                    ? 'rgba(245,133,41,0.30), rgba(221,42,123,0.25), rgba(129,52,175,0.28)'
                    : props.palette === 'instagram'
                    ? 'rgba(245,133,41,0.32), rgba(221,42,123,0.28), rgba(129,52,175,0.25)'
                    : 'rgba(245,133,41,0.32), rgba(129,52,175,0.25)'}
            );
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            &:hover:not(:disabled) {
                border-color: rgba(255, 255, 255, 0.7);
                transform: translateY(-1px);
                box-shadow: 0 12px 26px rgba(0, 0, 0, 0.25);
            }
            &:active:not(:disabled) {
                transform: translateY(0);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
            }
        `};

    ${(props) =>
        !props.variant &&
        props.palette === 'purpleRed' &&
        css`
            ${tw`text-white border-transparent`};
            background-image: linear-gradient(135deg, #a855f7, #ef4444);
            &:hover:not(:disabled) {
                filter: brightness(1.05);
            }
        `};

    ${(props) =>
        !props.variant &&
        props.palette === 'indigoPink' &&
        css`
            ${tw`text-white border-transparent`};
            background-image: linear-gradient(135deg, #f58529, #dd2a7b);
            &:hover:not(:disabled) {
                filter: brightness(1.1);
            }
        `};

    ${(props) =>
        !props.variant &&
        props.palette === 'cyanBlue' &&
        css`
            ${tw`text-white border-transparent`};
            background-image: linear-gradient(135deg, #dd2a7b, #8134af);
            &:hover:not(:disabled) {
                filter: brightness(1.1);
            }
        `};

    ${(props) =>
        !props.variant &&
        props.palette === 'sunset' &&
        css`
            ${tw`text-white border-transparent`};
            background-image: linear-gradient(135deg, #f59e0b, #f43f5e);
            &:hover:not(:disabled) {
                filter: brightness(1.05);
            }
        `};

    ${(props) =>
        !props.variant &&
        props.palette === 'rainbow' &&
        css`
            ${tw`text-white border-transparent`};
            background-image: linear-gradient(90deg, #a855f7, #06b6d4, #f59e0b, #f43f5e);
            &:hover:not(:disabled) {
                filter: brightness(1.05);
            }
        `};

    ${(props) =>
        !props.variant &&
        props.palette === 'instagram' &&
        css`
            ${tw`text-white border-transparent`};
            background-image: linear-gradient(135deg, #f58529, #dd2a7b, #8134af);
            &:hover:not(:disabled) {
                filter: brightness(1.1);
            }
        `};

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        filter: saturate(0.7);
    }
`;

type ComponentProps = Omit<JSX.IntrinsicElements['button'], 'ref' | keyof Props> & Props;

const Button: React.FC<ComponentProps> = ({ children, isLoading, ...props }) => (
    <ButtonStyle {...props}>
        {isLoading && (
            <div css={tw`flex absolute justify-center items-center w-full h-full left-0 top-0`}>
                <Spinner size={'small'} />
            </div>
        )}
        <span css={isLoading ? tw`text-transparent` : undefined}>{children}</span>
    </ButtonStyle>
);

type LinkProps = Omit<JSX.IntrinsicElements['a'], 'ref' | keyof Props> & Props;

const LinkButton: React.FC<LinkProps> = (props) => <ButtonStyle as={'a'} {...props} />;

export { LinkButton, ButtonStyle };
export default Button;
