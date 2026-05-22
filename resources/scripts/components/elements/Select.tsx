import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

interface Props {
    hideDropdownArrow?: boolean;
    variant?: 'default' | 'glass';
}

const glassStyle = css<Props>`
    background-color: var(--bg-elevated);
    backdrop-filter: blur(8px);
`;

const Select = styled.select<Props>`
    ${tw`block p-4 pr-10 rounded-xl w-full text-base transition-all duration-300 font-medium`};
    background-color: var(--bg-input);
    border: 1px solid var(--border-input);
    color: var(--text-primary);
    font-family: 'Satoshi', sans-serif;
    box-shadow: var(--shadow-input);

    &,
    &:hover:not(:disabled),
    &:focus {
        ${tw`outline-none`};
    }

    -webkit-appearance: none;
    -moz-appearance: none;
    background-size: 1.25rem;
    background-repeat: no-repeat;
    background-position-x: calc(100% - 1rem);
    background-position-y: center;

    &::-ms-expand {
        display: none;
    }

    & option {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
    }

    ${(props) =>
        !props.hideDropdownArrow &&
        css`
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='%2394A3B8' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/%3e%3c/svg%3e ");

            &:hover:not(:disabled) {
                border-color: var(--border-secondary);
            }

            &:focus {
                border-color: var(--border-focus);
                box-shadow: var(--shadow-focus);
            }
        `};

    ${(props) => props.variant === 'glass' && glassStyle};
`;

export default Select;
