import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import styled from 'styled-components/macro';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
    glass?: boolean;
}

const Container = styled.div<{ glass?: boolean }>`
    ${tw`rounded-2xl`};
    background: rgba(17, 24, 39, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(16px);
    color: #e5e7eb;
    transition: all 0.3s ease;

    &:hover {
        border-color: rgba(99, 102, 241, 0.3);
        background: rgba(17, 24, 39, 0.8);
    }
`;

const Header = styled.div<{ glass?: boolean }>`
    ${tw`rounded-t-2xl p-4 lg:p-5`};
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #ffffff;
    position: relative;
`;

const TitledGreyBox = ({ icon, title, children, className, glass }: Props) => (
    <Container glass={glass} className={className}>
        <Header glass={glass}>
            {typeof title === 'string' ? (
                <p
                    css={tw`text-sm uppercase font-bold tracking-widest`}
                    style={{
                        color: '#ffffff',
                    }}
                >
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-3 text-indigo-400`} />}
                    {title}
                </p>
            ) : (
                title
            )}
        </Header>
        <div css={tw`p-4 lg:p-6`}>{children}</div>
    </Container>
);

export default memo(TitledGreyBox, isEqual);
