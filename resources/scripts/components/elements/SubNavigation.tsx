import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full shadow overflow-x-auto`};
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.06), rgba(255, 51, 51, 0.04));
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 215, 0, 0.15);

    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`inline-block py-3 px-4 no-underline whitespace-nowrap transition-all duration-150`};
            color: rgba(255, 215, 0, 0.7);
            font-family: monospace;
            letter-spacing: 0.05em;

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                color: #ffd700;
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }

            &:active,
            &.active {
                color: #ffd700;
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
                box-shadow: inset 0 -2px #ffd700;
            }
        }
    }
`;

export default SubNavigation;
