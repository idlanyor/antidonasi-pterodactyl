import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Label = styled.label<{ isLight?: boolean; variant?: 'default' | 'glass' }>`
    ${tw`block text-sm mb-2`};
    color: #0f172a;
    font-weight: 700;
    font-family: 'Satoshi', sans-serif;

    ${(props) =>
        props.variant === 'glass' &&
        `
        color: #0F172A;
        font-weight: 900;
    `};
`;

export default Label;
