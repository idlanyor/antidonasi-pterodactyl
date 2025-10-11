import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full shadow overflow-x-auto`};
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(239, 68, 68, 0.08));
    backdrop-filter: blur(8px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`inline-block py-3 px-4 text-neutral-300 no-underline whitespace-nowrap transition-all duration-150`};

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                ${tw`text-neutral-100`};
            }

            &:active,
            &.active {
                ${tw`text-neutral-100`};
                box-shadow: inset 0 -2px #a855f7; /* purple-500 */
            }
        }
    }
`;

export default SubNavigation;
