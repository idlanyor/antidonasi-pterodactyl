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
    palette?: 'purpleRed' | 'indigoPink' | 'cyanBlue' | 'sunset' | 'rainbow';
}

const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    ${tw`relative inline-block rounded-lg p-2 tracking-wide text-sm transition-all duration-200 border shadow-sm`};

    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css<Props>`
            ${(props) =>
                !props.isSecondary &&
                tw`bg-gradient-to-br from-primary-400 to-primary-600 border-primary-700 text-white shadow-md`};

            &:hover:not(:disabled) {
                ${tw`bg-gradient-to-br from-primary-500 to-primary-700 border-primary-800 shadow-lg`};
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
            ${tw`border-neutral-500 bg-transparent text-neutral-200 backdrop-blur-sm`};

            &:hover:not(:disabled) {
                ${tw`border-neutral-400 text-neutral-100 bg-neutral-500/10`};
                ${(props) => props.color === 'red' && tw`bg-red-500/20 border-red-500 text-red-50`};
                ${(props) => props.color === 'primary' && tw`bg-primary-500/20 border-primary-500 text-primary-50`};
                ${(props) => props.color === 'green' && tw`bg-green-500/20 border-green-500 text-green-50`};
            }
        `};

    /* Glass variant overrides most color styling */
    ${(props) =>
        props.variant === 'glass' &&
        css`
            ${tw`bg-white/10 border-white/20 text-neutral-100 backdrop-blur-md`};
            background-image: linear-gradient(
                135deg,
                ${props.palette === 'indigoPink'
                    ? 'rgba(99,102,241,0.20), rgba(236,72,153,0.16)'
                    : props.palette === 'cyanBlue'
                    ? 'rgba(6,182,212,0.20), rgba(37,99,235,0.16)'
                    : props.palette === 'sunset'
                    ? 'rgba(245,158,11,0.22), rgba(244,63,94,0.16)'
                    : props.palette === 'rainbow'
                    ? 'rgba(59,130,246,0.20), rgba(16,185,129,0.18)'
                    : 'rgba(59,130,246,0.22), rgba(16,185,129,0.16)'}
            );
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            &:hover:not(:disabled) {
                ${tw`border-white/30`};
                transform: translateY(-1px);
                box-shadow: 0 12px 26px rgba(0, 0, 0, 0.16);
            }
            &:active:not(:disabled) {
                transform: translateY(0);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.14);
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
            background-image: linear-gradient(135deg, #6366f1, #ec4899);
            &:hover:not(:disabled) {
                filter: brightness(1.05);
            }
        `};

    ${(props) =>
        !props.variant &&
        props.palette === 'cyanBlue' &&
        css`
            ${tw`text-white border-transparent`};
            background-image: linear-gradient(135deg, #06b6d4, #2563eb);
            &:hover:not(:disabled) {
                filter: brightness(1.05);
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
