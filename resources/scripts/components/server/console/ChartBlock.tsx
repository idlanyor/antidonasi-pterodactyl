import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

interface ChartBlockProps {
    title: string;
    legend?: React.ReactNode;
    children: React.ReactNode;
}

const ChartCard = styled.div`
    ${tw`rounded-xl relative border transition-all duration-300`};
    background-color: #ffffff;
    border-color: #e2e8f0;
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);

    &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 -12px 36px 0 rgba(15, 23, 42, 0.12);
    }
`;

export default ({ title, legend, children }: ChartBlockProps) => (
    <ChartCard className={'group'}>
        <div className={'flex items-center justify-between px-6 py-4 border-b border-neutral-100'}>
            <h3
                className={'text-xs font-black uppercase tracking-widest text-brand-navy'}
                style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
                {title}
            </h3>
            {legend && <p className={'text-xs flex items-center text-brand-slate font-bold'}>{legend}</p>}
        </div>
        <div className={'z-10 p-4'}>{children}</div>
    </ChartCard>
);
