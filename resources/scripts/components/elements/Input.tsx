import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
    variant?: 'default' | 'glass';
}

const checkboxStyle = css<Props>`
    ${tw`cursor-pointer appearance-none inline-block align-middle select-none flex-shrink-0 w-5 h-5 rounded-md transition-all duration-200`};
    background-color: var(--checkbox-bg);
    border: 1px solid var(--checkbox-border);
    box-shadow: var(--shadow-sm);

    &:checked {
        ${tw`border-transparent bg-no-repeat bg-center`};
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23FFFFFF' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-color: var(--checkbox-checked-bg);
        border-color: var(--checkbox-checked-bg);
        box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.4);
    }

    &:focus {
        ${tw`outline-none`};
        box-shadow: var(--shadow-focus);
    }
`;

const inputStyle = css<Props>`
    // Reset to normal styling.
    resize: none;
    ${tw`appearance-none outline-none w-full min-w-0`};
    ${tw`p-4 rounded-xl text-base transition-all duration-300 font-medium`};
    background-color: var(--bg-input);
    border: 1px solid var(--border-input);
    color: var(--text-primary);
    font-family: 'Satoshi', sans-serif;
    box-shadow: var(--shadow-input);

    &::placeholder {
        color: var(--text-muted);
        font-weight: 400;
    }

    &:hover:not(:disabled):not(:read-only) {
        border-color: var(--border-secondary);
    }

    & + .input-help {
        ${tw`mt-2 text-sm font-medium`};
        color: ${(props) => (props.hasError ? '#EF4444' : 'var(--text-secondary)')};
    }

    &:not(:disabled):not(:read-only):focus {
        border-color: var(--border-focus);
        box-shadow: var(--shadow-focus);
        ${(props) =>
            props.hasError &&
            css`
                border-color: #ef4444;
                box-shadow: rgba(239, 68, 68, 0.15) 0px 0px 0px 3px;
            `};
    }

    &:disabled {
        ${tw`opacity-50`};
        background-color: var(--disabled-bg);
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
    background-color: var(--bg-elevated);
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
