import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import styled, { css } from 'styled-components/macro';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
    glass?: boolean;
}

const Container = styled.div<{ glass?: boolean }>`
    ${tw`rounded shadow-md`};
    ${(props) =>
        props.glass
            ? css`
                  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(59, 130, 246, 0.12));
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  backdrop-filter: blur(10px);
                  color: #fff;
              `
            : tw`bg-neutral-700`}
`;

const Header = styled.div<{ glass?: boolean }>`
    ${tw`rounded-t p-3 border-b`};
    ${(props) =>
        props.glass
            ? css`
                  background: linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(59, 130, 246, 0.18));
                  border-color: rgba(255, 255, 255, 0.12);
                  color: #fff;
              `
            : css`
                  ${tw`bg-neutral-900`};
                  border-color: black;
              `}
`;

const TitledGreyBox = ({ icon, title, children, className, glass }: Props) => (
    <Container glass={glass} className={className}>
        <Header glass={glass}>
            {typeof title === 'string' ? (
                <p css={tw`text-sm uppercase`}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-white`} />}
                    {title}
                </p>
            ) : (
                title
            )}
        </Header>
        <div css={tw`p-3`}>{children}</div>
    </Container>
);

export default memo(TitledGreyBox, isEqual);
