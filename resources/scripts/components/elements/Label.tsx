import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Label = styled.label<{ isLight?: boolean; variant?: 'default' | 'glass' }>`
    ${tw`block text-xs uppercase text-neutral-200 mb-1 sm:mb-2`};
    ${(props) => props.isLight && tw`text-neutral-700`};
    ${(props) => props.variant === 'glass' && tw`text-neutral-100 drop-shadow`};
`;

export default Label;
