import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full overflow-x-auto bg-neutral-900 border-b border-neutral-800 shadow-sm`};

    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`inline-block py-3 px-4 no-underline whitespace-nowrap transition-all duration-150`};
            ${tw`text-neutral-400 font-medium tracking-tight`};

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                ${tw`text-neutral-100 bg-neutral-800`};
                border-radius: 6px;
            }

            &:active,
            &.active {
                ${tw`text-neutral-100 bg-neutral-800`};
                border-radius: 6px;
            }
        }
    }
`;

export default SubNavigation;
