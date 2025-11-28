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
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(245, 133, 41, 0.2);
    box-shadow: 0 8px 25px rgba(245, 133, 41, 0.15), 0 4px 15px rgba(221, 42, 123, 0.08);
    backdrop-filter: blur(10px);
    color: #2d3748;
    transition: all 0.3s ease;

    &:hover {
        border-color: rgba(245, 133, 41, 0.3);
        box-shadow: 0 12px 35px rgba(245, 133, 41, 0.2), 0 6px 20px rgba(221, 42, 123, 0.1);
    }
`;

const Header = styled.div<{ glass?: boolean }>`
    ${tw`rounded-t-lg p-3`};
    background: linear-gradient(135deg, rgba(245, 133, 41, 0.1), rgba(221, 42, 123, 0.08));
    border-bottom: 1px solid rgba(245, 133, 41, 0.15);
    color: #f58529;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, #f58529, #dd2a7b, #8134af, transparent);
        opacity: 0.7;
    }
`;

const TitledGreyBox = ({ icon, title, children, className, glass }: Props) => (
    <Container glass={glass} className={className}>
        <Header glass={glass}>
            {typeof title === 'string' ? (
                <p
                    css={tw`text-sm uppercase font-semibold`}
                    style={{
                        color: '#f58529',
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        letterSpacing: '0.05em',
                    }}
                >
                    {icon && (
                        <FontAwesomeIcon
                            icon={icon}
                            css={tw`mr-2`}
                            style={{
                                color: '#dd2a7b',
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
