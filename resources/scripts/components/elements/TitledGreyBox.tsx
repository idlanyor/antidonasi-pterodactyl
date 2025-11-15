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
    ${tw`rounded-lg`};
    background: rgba(10, 10, 20, 0.85);
    border: 1px solid rgba(0, 255, 255, 0.3);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.15), 0 0 40px rgba(255, 0, 132, 0.1);
    backdrop-filter: blur(10px);
    color: #00ffff;
    transition: all 0.3s ease;

    &:hover {
        border-color: rgba(0, 255, 255, 0.5);
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.25), 0 0 60px rgba(255, 0, 132, 0.15);
    }
`;

const Header = styled.div<{ glass?: boolean }>`
    ${tw`rounded-t-lg p-3`};
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(255, 0, 132, 0.1));
    border-bottom: 1px solid rgba(0, 255, 255, 0.3);
    color: #00ffff;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00ffff, #ff0084, transparent);
        opacity: 0.6;
    }
`;

const TitledGreyBox = ({ icon, title, children, className, glass }: Props) => (
    <Container glass={glass} className={className}>
        <Header glass={glass}>
            {typeof title === 'string' ? (
                <p
                    css={tw`text-sm uppercase`}
                    style={{
                        color: '#00ffff',
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                        fontFamily: 'monospace',
                        letterSpacing: '0.1em',
                    }}
                >
                    {icon && (
                        <FontAwesomeIcon
                            icon={icon}
                            css={tw`mr-2`}
                            style={{
                                color: '#ff0084',
                                filter: 'drop-shadow(0 0 6px rgba(255, 0, 132, 0.6))',
                            }}
                        />
                    )}
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
