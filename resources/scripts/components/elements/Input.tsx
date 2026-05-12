import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
    variant?: 'default' | 'glass';
}

const light = css<Props>`
    ${tw`bg-white border-neutral-200 text-neutral-800`};
    &:focus {
        ${tw`border-primary-400`}
    }

    &:disabled {
        ${tw`bg-neutral-100 border-neutral-200`};
    }
`;

const checkboxStyle = css<Props>`
    ${tw`cursor-pointer appearance-none inline-block align-middle select-none flex-shrink-0 w-4 h-4 border rounded-sm`};
    background: rgba(10, 10, 20, 0.8);
    border-color: rgba(59, 130, 246, 0.4);
    color: #3b82f6;
    color-adjust: exact;
    background-origin: border-box;
    transition: all 150ms ease, box-shadow 100ms ease;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.2);

    &:checked {
        ${tw`border-transparent bg-no-repeat bg-center`};
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%233b82f6' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-color: rgba(59, 130, 246, 0.2);
        background-size: 100% 100%;
        border-color: rgba(59, 130, 246, 0.6);
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
    }

    &:focus {
        ${tw`outline-none`};
        border-color: rgba(59, 130, 246, 0.7);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    }
`;

const inputStyle = css<Props>`
    // Reset to normal styling.
    resize: none;
    ${tw`appearance-none outline-none w-full min-w-0`};
    ${tw`p-3 rounded text-sm transition-all duration-200`};
    background: rgba(10, 10, 20, 0.8);
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: #ffffff;
    font-family: 'Inter', system-ui, sans-serif;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.1);

    &::placeholder {
        color: rgba(255, 255, 255, 0.4);
    }

    &:hover {
        border-color: rgba(59, 130, 246, 0.5);
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
    }

    & + .input-help {
        ${tw`mt-1 text-xs`};
        color: ${(props) => (props.hasError ? '#ff4d4d' : 'rgba(255, 255, 255, 0.8)')};
        line-height: 1.4;
    }

    &:required,
    &:invalid {
        ${tw`shadow-none`};
    }

    &:not(:disabled):not(:read-only):focus {
        border-color: rgba(59, 130, 246, 0.7);
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 10px rgba(59, 130, 246, 0.05);
        ${(props) =>
            props.hasError &&
            css`
                border-color: rgba(255, 77, 77, 0.7);
                box-shadow: 0 0 20px rgba(255, 77, 77, 0.3), inset 0 0 10px rgba(255, 77, 77, 0.05);
            `};
    }

    &:disabled {
        ${tw`opacity-50`};
        cursor: not-allowed;
    }

    ${(props) => props.isLight && light};
    ${(props) =>
        props.hasError &&
        css`
            color: #ff4d4d;
            border-color: rgba(255, 77, 77, 0.5);
            &:hover {
                border-color: rgba(255, 77, 77, 0.7);
            }
        `};
`;

const glassStyle = css<Props>`
    ${tw`backdrop-blur-md`};
    background: rgba(10, 10, 20, 0.7);
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: #ffffff;
    &:hover {
        border-color: rgba(59, 130, 246, 0.5);
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
    }
    &:not(:disabled):not(:read-only):focus {
        border-color: rgba(59, 130, 246, 0.7);
        box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);
    }
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
