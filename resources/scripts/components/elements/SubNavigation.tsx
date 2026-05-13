import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full overflow-x-auto bg-white border-b border-neutral-200 shadow-sm`};

    & > div {
        ${tw`flex items-center text-sm mx-auto px-4`};
        max-width: 1280px;

        & > a,
        & > div {
            ${tw`inline-block py-4 px-6 no-underline whitespace-nowrap transition-all duration-300`};
            ${tw`text-brand-slate font-black tracking-tight`};

            &:hover {
                ${tw`text-brand-navy bg-neutral-50`};
            }

            &:active,
            &.active {
                ${tw`text-accent-purple`};
                position: relative;
                &::after {
                    content: '';
                    ${tw`absolute bottom-0 left-0 w-full h-[2px] bg-accent-purple`};
                }
            }
        }
    }
`;

export default SubNavigation;
