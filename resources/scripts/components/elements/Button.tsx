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
    ${tw`relative inline-flex items-center justify-center font-bold transition-all duration-300 border-none outline-none cursor-pointer`};
    font-family: 'Satoshi', sans-serif;

    /* Sizes */
    ${(props) => (!props.size || props.size === 'small') && tw`px-5 py-2.5 text-[12px] rounded-lg h-[36px]`};
    ${(props) => props.size === 'large' && tw`px-6 py-2.5 text-[12px] rounded-[4px] h-[40px]`};
    ${(props) => props.size === 'xsmall' && tw`px-3 py-1.5 text-[11px] rounded-[4px] h-auto`};
    ${(props) => props.size === 'xlarge' && tw`w-full px-6 py-3 text-[14px] rounded-xl h-[56px]`};

    /* Primary CTA (Default) */
    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css`
            ${tw`text-white shadow-md`};
            background: linear-gradient(135deg, #ec4899 0%, #7c3aed 100%);
            box-shadow: 0 14px 30px 0 rgba(168, 85, 247, 0.24);

            &:hover:not(:disabled) {
                opacity: 0.9;
                box-shadow: 0 18px 36px 0 rgba(168, 85, 247, 0.32);
                transform: translateY(-1px);
            }

            &:active:not(:disabled) {
                opacity: 0.85;
                box-shadow: 0 8px 20px 0 rgba(168, 85, 247, 0.2);
                transform: translateY(0);
            }
        `};

    /* Secondary Button */
    ${(props) =>
        (props.isSecondary || props.color === 'grey') &&
        css`
            ${tw`bg-neutral-100 text-brand-slate border border-neutral-200 shadow-sm`};
            background-color: #f1f5f9;

            &:hover:not(:disabled) {
                ${tw`bg-neutral-200 text-brand-navy`};
                background-color: #e2e8f0;
            }

            &:active:not(:disabled) {
                ${tw`bg-neutral-300 shadow-inner`};
                background-color: #cbd5e1;
            }
        `};

    /* Red (Danger) Button */
    ${(props) =>
        props.color === 'red' &&
        css`
            ${tw`bg-status-error text-white shadow-md`};
            background-color: #ef4444;

            &:hover:not(:disabled) {
                filter: brightness(1.1);
                box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.2);
            }
        `};

    /* Green (Success) Button */
    ${(props) =>
        props.color === 'green' &&
        css`
            ${tw`bg-status-success text-white shadow-md`};
            background-color: #10b981;

            &:hover:not(:disabled) {
                filter: brightness(1.1);
                box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
            }
        `};

    /* Ghost variant */
    ${(props) =>
        props.variant === 'glass' &&
        css`
            ${tw`bg-transparent text-brand-slate shadow-none border-none`};
            font-size: 11px;
            font-weight: 600;

            &:hover:not(:disabled) {
                ${tw`text-brand-navy bg-neutral-50`};
                background-color: #f8fafc;
            }
        `};

    &:disabled {
        ${tw`opacity-50 cursor-not-allowed`};
        box-shadow: none;
        transform: none;
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
