import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

interface Props {
    hideDropdownArrow?: boolean;
    variant?: 'default' | 'glass';
}

const glassStyle = css<Props>`
    ${tw`backdrop-blur-md`};
    background-color: rgba(10, 10, 20, 0.7);
    border: 1px solid rgba(0, 255, 255, 0.3);
    color: #00ffff;
    &:hover {
        border-color: rgba(0, 255, 255, 0.5);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    }
    &:not(:disabled):not(:read-only):focus {
        border-color: rgba(0, 255, 255, 0.7);
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.4);
    }
`;

const Select = styled.select<Props>`
    ${tw`block p-3 pr-8 rounded w-full text-sm transition-all duration-200 ease-linear`};
    background-color: rgba(10, 10, 20, 0.8);
    border: 1px solid rgba(0, 255, 255, 0.3);
    color: #00ffff;
    font-family: monospace;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);

    &,
    &:hover:not(:disabled),
    &:focus {
        ${tw`outline-none`};
    }

    -webkit-appearance: none;
    -moz-appearance: none;
    background-size: 1rem;
    background-repeat: no-repeat;
    background-position-x: calc(100% - 0.75rem);
    background-position-y: center;

    &::-ms-expand {
        display: none;
    }

    & option {
        background-color: rgba(10, 10, 20, 0.95);
        color: #00ffff;
    }

    ${(props) =>
        !props.hideDropdownArrow &&
        css`
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='%2300ffff' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/%3e%3c/svg%3e ");

            &:hover:not(:disabled) {
                border-color: rgba(0, 255, 255, 0.5);
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
            }

            &:focus {
                border-color: rgba(0, 255, 255, 0.7);
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            }
        `};

    ${(props) => props.variant === 'glass' && glassStyle};
`;

export default Select;
