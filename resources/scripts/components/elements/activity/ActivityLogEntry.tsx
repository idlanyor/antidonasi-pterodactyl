import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Translate from '@/components/elements/Translate';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ActivityLog } from '@definitions/user';
import ActivityLogMetaButton from '@/components/elements/activity/ActivityLogMetaButton';
import { FolderOpenIcon, TerminalIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import style from './style.module.css';
import Avatar from '@/components/Avatar';
import useLocationHash from '@/plugins/useLocationHash';
import { getObjectKeys, isObject } from '@/lib/objects';
import tw from 'twin.macro';

interface Props {
    activity: ActivityLog;
    children?: React.ReactNode;
}

function wrapProperties(value: unknown): any {
    if (value === null || typeof value === 'string' || typeof value === 'number') {
        return `<strong>${String(value)}</strong>`;
    }

    if (isObject(value)) {
        return getObjectKeys(value).reduce((obj, key) => {
            if (key === 'count' || (typeof key === 'string' && key.endsWith('_count'))) {
                return { ...obj, [key]: value[key] };
            }
            return { ...obj, [key]: wrapProperties(value[key]) };
        }, {} as Record<string, unknown>);
    }

    if (Array.isArray(value)) {
        return value.map(wrapProperties);
    }

    return value;
}

export default ({ activity, children }: Props) => {
    const { pathTo } = useLocationHash();
    const actor = activity.relationships.actor;
    const properties = wrapProperties(activity.properties);

    return (
        <div
            className={'grid grid-cols-10 py-6 border-b last:rounded-b last:border-0 group transition-all duration-300'}
            style={{
                borderColor: 'var(--border-primary)',
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-hover)'; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
        >
            <div className={'hidden sm:flex sm:col-span-1 items-center justify-center select-none'}>
                <div
                    className={'flex items-center w-12 h-12 rounded-2xl overflow-hidden shadow-sm border'}
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--border-primary)',
                    }}
                >
                    <Avatar name={actor?.uuid || 'system'} />
                </div>
            </div>
            <div className={'col-span-10 sm:col-span-9 flex'}>
                <div className={'flex-1 px-6 sm:px-4'}>
                    <div className={'flex items-center font-black tracking-tight'} style={{ color: 'var(--text-primary)' }}>
                        <Tooltip placement={'top'} content={actor?.email || 'System User'}>
                            <span css={tw`hover:text-accent-purple transition-colors`}>
                                {actor?.username || 'System'}
                            </span>
                        </Tooltip>
                        <span className={'opacity-40'} style={{ color: 'var(--text-secondary)' }}>&nbsp;&mdash;&nbsp;</span>
                        <Link
                            to={`#${pathTo({ event: activity.event })}`}
                            className={
                                'transition-colors duration-300 text-accent-purple hover:text-accent-purple-light'
                            }
                        >
                            {activity.event}
                        </Link>
                        <div className={classNames(style.icons, 'group-hover:text-neutral-900')}>
                            {activity.isApi && (
                                <Tooltip placement={'top'} content={'Using API Key'}>
                                    <TerminalIcon />
                                </Tooltip>
                            )}
                            {activity.event.startsWith('server:sftp.') && (
                                <Tooltip placement={'top'} content={'Using SFTP'}>
                                    <FolderOpenIcon />
                                </Tooltip>
                            )}
                            {children}
                        </div>
                    </div>
                    <p className={classNames(style.description, 'font-bold text-sm mt-1')} style={{ color: 'var(--text-primary)' }}>
                        <Translate ns={'activity'} values={properties} i18nKey={activity.event.replace(':', '.')} />
                    </p>
                    <div className={'mt-2 flex items-center text-xs font-bold'} style={{ color: 'var(--text-secondary)' }}>
                        {activity.ip && (
                            <span>
                                {activity.ip}
                                <span className={'opacity-40'} style={{ color: 'var(--text-secondary)' }}>&nbsp;|&nbsp;</span>
                            </span>
                        )}
                        <Tooltip placement={'right'} content={format(activity.timestamp, 'MMM do, yyyy H:mm:ss')}>
                            <span>{formatDistanceToNowStrict(activity.timestamp, { addSuffix: true })}</span>
                        </Tooltip>
                    </div>
                </div>
                {activity.hasAdditionalMetadata && (
                    <div css={tw`flex items-center pr-6`}>
                        <ActivityLogMetaButton meta={activity.properties} />
                    </div>
                )}
            </div>
        </div>
    );
};
