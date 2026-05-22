import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Label = styled.label<{ isLight?: boolean; variant?: 'default' | 'glass' }>`
    ${tw`block text-sm mb-2`};
    color: var(--text-primary);
    font-weight: 700;
    font-family: 'Satoshi', sans-serif;

    ${(props) =>
        props.variant === 'glass' &&
        `
        color: var(--text-primary);
        font-weight: 900;
    `};
`;

export default Label;
