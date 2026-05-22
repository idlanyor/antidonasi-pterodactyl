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
    background-color: var(--bg-elevated);
    border: 1px solid var(--border-primary);
    box-shadow: var(--shadow-lg);
    color: var(--text-primary);
    transition: all 0.3s ease;

    &:hover {
        border-color: var(--border-secondary);
        box-shadow: var(--shadow-lg-hover);
    }
`;

const Header = styled.div<{ glass?: boolean }>`
    ${tw`rounded-t-xl p-4 lg:p-6`};
    background-color: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-primary);
    color: var(--text-primary);
    position: relative;
`;

const TitledGreyBox = ({ icon, title, children, className, glass }: Props) => (
    <Container glass={glass} className={className}>
        <Header glass={glass}>
            {typeof title === 'string' ? (
                <p
                    css={tw`text-[11px] uppercase font-black tracking-widest`}
                    style={{ color: 'var(--text-primary)' }}
                >
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-3`} style={{ color: '#7C3AED' }} />}
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
