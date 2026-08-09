import React from 'react';
import Icon from '@/components/elements/Icon';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import useFitText from 'use-fit-text';
import CopyOnClick from '@/components/elements/CopyOnClick';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    icon: IconDefinition;
    children: React.ReactNode;
    className?: string;
}

const StatCard = styled.div`
    ${tw`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300`};
    background-color: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);

    &:hover {
        border-color: var(--border-secondary);
        box-shadow: var(--shadow-lg-hover);
    }
`;

const IconWrapper = styled.div`
    ${tw`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 bg-accent-10 text-accent-purple`};
`;

export default ({ title, copyOnClick, icon, className, children }: StatBlockProps) => {
    const { fontSize, ref } = useFitText({ minFontSize: 8, maxFontSize: 500 });

    return (
        <CopyOnClick text={copyOnClick}>
            <StatCard className={className}>
                <IconWrapper>
                    <Icon icon={icon} className={'w-4 h-4'} />
                </IconWrapper>
                <div className={'flex flex-col justify-center overflow-hidden w-full'}>
                    <p
                        className={'text-[10px] font-black uppercase tracking-widest'}
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {title}
                    </p>
                    <div
                        ref={ref}
                        className={'h-[1.75rem] w-full font-black truncate tracking-tight'}
                        style={{ fontSize, fontFamily: "'Raleway', sans-serif", color: 'var(--text-primary)' }}
                    >
                        {children}
                    </div>
                </div>
            </StatCard>
        </CopyOnClick>
    );
};
