import React from 'react';
import classNames from 'classnames';

interface CodeProps {
    dark?: boolean | undefined;
    className?: string;
    children: React.ReactChild | React.ReactFragment | React.ReactPortal;
}

export default ({ dark, className, children }: CodeProps) => (
    <code
        className={classNames('font-mono text-sm px-2 py-1 inline-block rounded-lg font-bold', className)}
        style={{
            backgroundColor: dark ? 'var(--bg-primary)' : 'var(--bg-code)',
            color: dark ? 'var(--text-inverse)' : 'var(--text-primary)',
        }}
    >
        {children}
    </code>
);
