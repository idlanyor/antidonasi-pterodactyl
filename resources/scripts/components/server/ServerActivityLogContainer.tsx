import React, { useEffect, useState } from 'react';
import { useActivityLogs } from '@/api/server/activity';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useFlashKey } from '@/plugins/useFlash';
import FlashMessageRender from '@/components/FlashMessageRender';
import Spinner from '@/components/elements/Spinner';
import ActivityLogEntry from '@/components/elements/activity/ActivityLogEntry';
import PaginationFooter from '@/components/elements/table/PaginationFooter';
import { ActivityLogFilters } from '@/api/account/activity';
import { Link } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/solid';
import useLocationHash from '@/plugins/useLocationHash';
import styles from './ServerActivityLog.module.css';
import tw from 'twin.macro';

export default () => {
    const { hash } = useLocationHash();
    const { clearAndAddHttpError } = useFlashKey('server:activity');
    const [filters, setFilters] = useState<ActivityLogFilters>({ page: 1, sorts: { timestamp: -1 } });

    const { data, isValidating, error } = useActivityLogs(filters, {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        setFilters((value) => ({ ...value, filters: { ip: hash.ip, event: hash.event } }));
    }, [hash]);

    useEffect(() => {
        clearAndAddHttpError(error);
    }, [error]);

    return (
        <ServerContentBlock title={'Activity Log'}>
            <FlashMessageRender byKey={'server:activity'} />
            {(filters.filters?.event || filters.filters?.ip) && (
                <div className={'flex justify-end mb-6'}>
                    <Link
                        to={'#'}
                        css={tw`inline-flex items-center justify-center px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-sm border`}
                        style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                            borderColor: 'var(--border-primary)',
                        }}
                        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-hover)'; }}
                        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-tertiary)'; }}
                        onClick={() => setFilters((value) => ({ ...value, filters: {} }))}
                    >
                        Clear Filters <XCircleIcon className={'w-4 h-4 ml-2'} />
                    </Link>
                </div>
            )}
            {!data && isValidating ? (
                <Spinner centered size={'large'} />
            ) : !data?.items.length ? (
                <p css={tw`text-sm text-center py-20 font-bold`} style={{ color: 'var(--text-secondary)' }}>
                    No activity logs available for this server.
                </p>
            ) : (
                <div
                    css={tw`rounded-xl overflow-hidden border`}
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--border-primary)',
                        boxShadow: 'var(--shadow-lg)',
                    }}
                >
                    <div className={styles.content}>
                        {data?.items.map((activity) => (
                            <ActivityLogEntry key={activity.id} activity={activity}>
                                <span />
                            </ActivityLogEntry>
                        ))}
                    </div>
                </div>
            )}
            {data && (
                <div css={tw`mt-8`}>
                    <PaginationFooter
                        pagination={data.pagination}
                        onPageSelect={(page) => setFilters((value) => ({ ...value, page }))}
                    />
                </div>
            )}
        </ServerContentBlock>
    );
};
