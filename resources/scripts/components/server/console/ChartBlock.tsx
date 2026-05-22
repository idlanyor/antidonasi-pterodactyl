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
    background-color: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);

    &:hover {
        border-color: var(--border-secondary);
        box-shadow: var(--shadow-lg-hover);
    }
`;

export default ({ title, legend, children }: ChartBlockProps) => (
    <ChartCard className={'group'}>
        <div
            className={'flex items-center justify-between px-6 py-4'}
            style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
            <h3
                className={'text-xs font-black uppercase tracking-widest'}
                style={{ fontFamily: "'Satoshi', sans-serif", color: 'var(--text-primary)' }}
            >
                {title}
            </h3>
            {legend && (
                <p className={'text-xs flex items-center font-bold'} style={{ color: 'var(--text-secondary)' }}>
                    {legend}
                </p>
            )}
        </div>
        <div className={'z-10 p-4'}>{children}</div>
    </ChartCard>
);
