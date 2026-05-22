import React from 'react';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import classNames from 'classnames';

interface Props {
    cron: Schedule['cron'];
    className?: string;
}

const ScheduleCronRow = ({ cron, className }: Props) => (
    <div className={classNames('flex', className)}>
        <div className={'w-1/5 sm:w-auto text-center'}>
            <p className={'font-black text-neutral-900'}>{cron.minute}</p>
            <p className={'text-[10px] text-neutral-500 uppercase font-bold tracking-widest'}>Minute</p>
        </div>
        <div className={'w-1/5 sm:w-auto text-center ml-4'}>
            <p className={'font-black text-neutral-900'}>{cron.hour}</p>
            <p className={'text-[10px] text-neutral-500 uppercase font-bold tracking-widest'}>Hour</p>
        </div>
        <div className={'w-1/5 sm:w-auto text-center ml-4'}>
            <p className={'font-black text-neutral-900'}>{cron.dayOfMonth}</p>
            <p className={'text-[10px] text-neutral-500 uppercase font-bold tracking-widest'}>Day (M)</p>
        </div>
        <div className={'w-1/5 sm:w-auto text-center ml-4'}>
            <p className={'font-black text-neutral-900'}>{cron.month}</p>
            <p className={'text-[10px] text-neutral-500 uppercase font-bold tracking-widest'}>Month</p>
        </div>
        <div className={'w-1/5 sm:w-auto text-center ml-4'}>
            <p className={'font-black text-neutral-900'}>{cron.dayOfWeek}</p>
            <p className={'text-[10px] text-neutral-500 uppercase font-bold tracking-widest'}>Day (W)</p>
        </div>
    </div>
);

export default ScheduleCronRow;
