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
    background-color: #ffffff;
    border-color: #e2e8f0;
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);

    &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 -12px 36px 0 rgba(15, 23, 42, 0.12);
    }
`;

const IconWrapper = styled.div`
    ${tw`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 bg-accent-purple bg-opacity-10 text-accent-purple`};
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
                    <p className={'text-[10px] font-black uppercase tracking-widest text-brand-slate'}>{title}</p>
                    <div
                        ref={ref}
                        className={'h-[1.75rem] w-full font-black text-brand-navy truncate tracking-tight'}
                        style={{ fontSize, fontFamily: "'Satoshi', sans-serif" }}
                    >
                        {children}
                    </div>
                </div>
            </StatCard>
        </CopyOnClick>
    );
};
