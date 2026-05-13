import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
    variant?: 'default' | 'glass';
}

// const light = css<Props>`
//     ${tw`bg-white border-neutral-200 text-neutral-800`};
//     &:focus {
//         ${tw`border-primary-400`}
//     }

//     &:disabled {
//         ${tw`bg-neutral-100 border-neutral-200`};
//     }
// `;

const checkboxStyle = css<Props>`
    ${tw`cursor-pointer appearance-none inline-block align-middle select-none flex-shrink-0 w-5 h-5 border rounded-md transition-all duration-200`};
    background-color: #ffffff;
    border-color: #e2e8f0;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:checked {
        ${tw`border-transparent bg-no-repeat bg-center`};
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23FFFFFF' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-color: #7c3aed;
        border-color: #7c3aed;
        box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.4);
    }

    &:focus {
        ${tw`outline-none`};
        box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.25);
    }
`;

const inputStyle = css<Props>`
    // Reset to normal styling.
    resize: none;
    ${tw`appearance-none outline-none w-full min-w-0`};
    ${tw`p-4 rounded-xl text-base transition-all duration-300 font-medium`};
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    color: #0f172a;
    font-family: 'Satoshi', sans-serif;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

    &::placeholder {
        color: #a3a3a3;
        font-weight: 400;
    }

    &:hover:not(:disabled):not(:read-only) {
        border-color: #cbd5e1;
    }

    & + .input-help {
        ${tw`mt-2 text-sm font-medium`};
        color: ${(props) => (props.hasError ? '#EF4444' : '#64748B')};
    }

    &:not(:disabled):not(:read-only):focus {
        border-color: #7c3aed;
        box-shadow: rgba(168, 85, 247, 0.25) 0px 0px 0px 3px;
        ${(props) =>
            props.hasError &&
            css`
                border-color: #ef4444;
                box-shadow: rgba(239, 68, 68, 0.15) 0px 0px 0px 3px;
            `};
    }

    &:disabled {
        ${tw`opacity-50`};
        background-color: #f8fafc;
        cursor: not-allowed;
    }

    ${(props) =>
        props.hasError &&
        css`
            border: 2px solid #ef4444;
            color: #ef4444;
        `};
`;

const glassStyle = css<Props>`
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
`;

const Input = styled.input<Props>`
    &:not([type='checkbox']):not([type='radio']) {
        ${inputStyle};
        ${(props) => props.variant === 'glass' && glassStyle};
    }

    &[type='checkbox'],
    &[type='radio'] {
        ${checkboxStyle};

        &[type='radio'] {
            ${tw`rounded-full`};
        }
    }
`;
const Textarea = styled.textarea<Props>`
    ${inputStyle}
`;

export { Textarea };
export default Input;
