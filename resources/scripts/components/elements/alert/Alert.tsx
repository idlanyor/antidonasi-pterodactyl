import { ExclamationIcon, ShieldExclamationIcon } from '@heroicons/react/outline';
import React from 'react';
import classNames from 'classnames';

interface AlertProps {
    type: 'warning' | 'danger';
    className?: string;
    children: React.ReactNode;
}

export default ({ type, className, children }: AlertProps) => {
    return (
        <div
            className={classNames(
                'flex items-center border-l-4 rounded-xl shadow-sm px-6 py-4 font-bold text-sm',
                {
                    ['border-status-error bg-red-50 text-status-error']: type === 'danger',
                    ['border-status-warning bg-amber-50 text-status-warning']: type === 'warning',
                },
                className
            )}
            style={{ fontFamily: "'Satoshi', sans-serif" }}
        >
            {type === 'danger' ? (
                <ShieldExclamationIcon className={'w-5 h-5 mr-3'} />
            ) : (
                <ExclamationIcon className={'w-5 h-5 mr-3'} />
            )}
            {children}
        </div>
    );
};
