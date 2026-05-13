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
    ${tw`rounded-xl`};
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);
    color: #0f172a;
    transition: all 0.3s ease;

    &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 -12px 36px 0 rgba(15, 23, 42, 0.12);
    }
`;

const Header = styled.div<{ glass?: boolean }>`
    ${tw`rounded-t-xl p-4 lg:p-6`};
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    color: #0f172a;
    position: relative;
`;

const TitledGreyBox = ({ icon, title, children, className, glass }: Props) => (
    <Container glass={glass} className={className}>
        <Header glass={glass}>
            {typeof title === 'string' ? (
                <p css={tw`text-[11px] uppercase font-black tracking-widest text-brand-navy`}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-3 text-accent-purple`} />}
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
