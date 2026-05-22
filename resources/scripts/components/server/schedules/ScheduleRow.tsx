import React from 'react';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import tw from 'twin.macro';
import ScheduleCronRow from '@/components/server/schedules/ScheduleCronRow';

export default ({ schedule }: { schedule: Schedule }) => (
    <>
        <div
            css={tw`hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-accent-purple bg-opacity-10 text-accent-purple`}
        >
            <FontAwesomeIcon icon={faCalendarAlt} />
        </div>
        <div css={tw`flex-1 md:ml-6`}>
            <p css={tw`text-base font-black text-neutral-900 tracking-tight`}>{schedule.name}</p>
            <p css={tw`text-xs text-neutral-500 font-bold mt-0.5`}>
                Last run at: {schedule.lastRunAt ? format(schedule.lastRunAt, "MMM do 'at' h:mma") : 'never'}
            </p>
        </div>
        <div>
            <p
                css={[
                    tw`py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest sm:hidden`,
                    schedule.isActive
                        ? tw`bg-status-success bg-opacity-10 text-status-success`
                        : tw`bg-neutral-50 text-neutral-500`,
                ]}
            >
                {schedule.isActive ? 'Active' : 'Inactive'}
            </p>
        </div>
        <ScheduleCronRow cron={schedule.cron} css={tw`mx-auto sm:mx-8 w-full sm:w-auto mt-4 sm:mt-0`} />
        <div>
            <p
                css={[
                    tw`py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:block`,
                    schedule.isActive && !schedule.isProcessing
                        ? tw`bg-status-success bg-opacity-10 text-status-success`
                        : schedule.isProcessing
                        ? tw`bg-status-warning bg-opacity-10 text-status-warning`
                        : tw`bg-neutral-50 text-neutral-500`,
                ]}
            >
                {schedule.isProcessing ? 'Processing' : schedule.isActive ? 'Active' : 'Inactive'}
            </p>
        </div>
    </>
);
