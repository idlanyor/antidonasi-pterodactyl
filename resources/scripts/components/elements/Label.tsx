import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Label = styled.label<{ isLight?: boolean; variant?: 'default' | 'glass' }>`
    ${tw`block text-xs uppercase mb-1 sm:mb-2`};
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    letter-spacing: 0.05em;
    ${(props) => props.isLight && tw`text-neutral-700`};
    ${(props) =>
        props.variant === 'glass' &&
        `
        color: #000000;
        font-weight: 700;
    `};
`;

export default Label;
