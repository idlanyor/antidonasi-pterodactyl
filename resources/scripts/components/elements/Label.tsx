import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Label = styled.label<{ isLight?: boolean; variant?: 'default' | 'glass' }>`
    ${tw`block text-xs uppercase mb-1 sm:mb-2`};
    color: ${(props) => (props.isLight ? 'rgba(0, 0, 0, 0.8)' : '#e5e7eb')};
    font-weight: 600;
    letter-spacing: 0.05em;

    ${(props) =>
        props.variant === 'glass' &&
        `
        color: ${props.isLight ? '#000000' : '#ffffff'};
        font-weight: 700;
        text-shadow: ${props.isLight ? 'none' : '0 0 10px rgba(255, 255, 255, 0.2)'};
    `};
`;

export default Label;
