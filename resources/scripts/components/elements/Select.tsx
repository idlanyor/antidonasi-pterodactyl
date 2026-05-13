import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

interface Props {
    hideDropdownArrow?: boolean;
    variant?: 'default' | 'glass';
}

const glassStyle = css<Props>`
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
`;

const Select = styled.select<Props>`
    ${tw`block p-4 pr-10 rounded-xl w-full text-base transition-all duration-300 font-medium`};
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    color: #0f172a;
    font-family: 'Satoshi', sans-serif;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

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
        background-color: #ffffff;
        color: #0f172a;
    }

    ${(props) =>
        !props.hideDropdownArrow &&
        css`
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='%2364748B' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/%3e%3c/svg%3e ");

            &:hover:not(:disabled) {
                border-color: #cbd5e1;
            }

            &:focus {
                border-color: #7c3aed;
                box-shadow: rgba(168, 85, 247, 0.25) 0px 0px 0px 3px;
            }
        `};

    ${(props) => props.variant === 'glass' && glassStyle};
`;

export default Select;
