import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full overflow-x-auto`};
    background-color: var(--nav-bg);
    border-bottom: 1px solid var(--border-primary);
    box-shadow: var(--shadow-sm);
    transition: background-color 0.3s ease, border-color 0.3s ease;

    & > div {
        ${tw`flex items-center text-sm mx-auto px-4`};
        max-width: 1280px;

        & > a,
        & > div {
            ${tw`inline-block py-4 px-6 no-underline whitespace-nowrap transition-all duration-300`};
            color: var(--text-secondary);
            font-weight: 900;
            letter-spacing: -0.025em;

            &:hover {
                color: var(--text-primary);
                background-color: var(--bg-hover);
            }

            &:active,
            &.active {
                color: var(--sidebar-text-active);
                position: relative;
                &::after {
                    content: '';
                    ${tw`absolute bottom-0 left-0 w-full h-[2px]`};
                    background-color: var(--sidebar-text-active);
                }
            }
        }
    }
`;

export default SubNavigation;
