import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full shadow overflow-x-auto`};
    background: linear-gradient(135deg, rgba(245, 133, 41, 0.9), rgba(221, 42, 123, 0.9));
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.15);

    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`inline-block py-3 px-4 no-underline whitespace-nowrap transition-all duration-150`};
            color: rgba(255, 255, 255, 0.85);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            letter-spacing: 0.02em;
            font-weight: 500;

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                color: #ffffff;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }

            &:active,
            &.active {
                color: #ffffff;
                background: rgba(255, 255, 255, 0.15);
                box-shadow: inset 0 -2px rgba(255, 255, 255, 0.8);
                border-radius: 8px;
            }
        }
    }
`;

export default SubNavigation;
