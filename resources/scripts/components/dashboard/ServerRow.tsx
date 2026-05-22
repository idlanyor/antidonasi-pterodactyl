import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEthernet,
    faHdd,
    faMemory,
    faMicrochip,
    faServer,
    faMapMarkerAlt,
    faGlobe,
    faExclamationTriangle,
    faTimesCircle,
    faBoxOpen,
    faCog,
    faHistory,
    faPauseCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import styled, { keyframes } from 'styled-components/macro';
import isEqual from 'react-fast-compare';

// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
    styled(FontAwesomeIcon)<{ $alarm: boolean }>`
        ${(props) => (props.$alarm ? 'color: #EF4444;' : 'color: #7C3AED;')};
    `,
    isEqual
);

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(1); }
`;

const StatusIndicatorBox = styled(GreyRowBox)<{ $status: ServerPowerState | undefined }>`
    ${tw`relative flex flex-col md:flex-row h-auto`};
    ${tw`rounded-xl p-0 transition-all duration-300`};
    background-color: var(--bg-elevated);
    border: 1px solid var(--border-primary);
    box-shadow: var(--shadow-lg);
    overflow: hidden;

    &:hover {
        border-color: var(--border-secondary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg-hover);
    }

    & .status-badge {
        ${tw`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-2 mt-1 md:mt-0`};
        ${({ $status }) => {
            if (!$status || $status === 'offline') {
                return 'background: var(--status-error-bg); color: var(--status-error-text); border: 1px solid var(--status-error-border);';
            }
            if ($status === 'running') {
                return 'background: var(--status-success-bg); color: var(--status-success-text); border: 1px solid var(--status-success-border);';
            }
            return 'background: var(--status-warning-bg); color: var(--status-warning-text); border: 1px solid var(--status-warning-border);';
        }};
    }

    & .status-dot {
        ${tw`w-2 h-2 rounded-full`};
        animation: ${pulse} 2s ease-in-out infinite;
        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-status-error shadow-[0_0_8px_rgba(239,68,68,0.5)]`
                : $status === 'running'
                ? tw`bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.5)]`
                : tw`bg-status-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]`};
    }

    & .section-left {
        ${tw`flex items-center gap-4 p-5 md:w-[300px] flex-shrink-0`};
        ${tw`border-b md:border-b-0 md:border-r`};
        border-color: var(--section-divider);
    }

    & .section-middle {
        ${tw`flex-1 p-5 bg-transparent`};
    }

    & .section-right {
        ${tw`p-5 md:w-[400px] flex-shrink-0`};
        ${tw`border-t md:border-t-0 md:border-l`};
        border-color: var(--section-divider);
    }

    & .info-card {
        ${tw`px-4 py-2 rounded-xl transition-all duration-200`};
        background-color: var(--info-card-bg);
        border: 1px solid var(--info-card-border);

        &:hover {
            background-color: var(--info-card-hover-bg);
            border-color: var(--info-card-hover-border);
        }
    }

    & .stat-item {
        ${tw`flex-1 min-w-0`};
    }

    & .mobile-metrics {
        ${tw`flex items-center gap-3 text-[11px] font-black`};
        color: var(--text-primary);

        & span {
            ${tw`flex items-center gap-1.5`};
        }
    }

    & .mobile-details {
        ${tw`mt-3 grid grid-cols-2 gap-2 text-[11px] font-bold`};
        color: var(--text-secondary);
    }
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        // Don't waste a HTTP request if there is nothing important to show to the user because
        // the server is suspended.
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    return (
        <StatusIndicatorBox as={Link} to={`/server/${server.id}`} className={className} $status={stats?.status}>
            {/* Left Section: Icon + Name */}
            <div className='section-left'>
                <div
                    css={tw`flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0 shadow-sm`}
                    style={{
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        border: '1px solid rgba(124, 58, 237, 0.2)',
                    }}
                >
                    <FontAwesomeIcon icon={faServer} css={tw`text-accent-purple text-lg`} />
                </div>
                <div css={tw`flex-1 min-w-0`}>
                    <div css={tw`flex flex-col md:flex-row md:items-center gap-2 md:gap-4`}>
                        <p
                            css={tw`text-base font-black truncate tracking-tight`}
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {server.name}
                        </p>
                        <div className={'status-badge'}>
                            <div className={'status-dot'} />
                            {!stats?.status || stats.status === 'offline'
                                ? 'Offline'
                                : stats.status === 'running'
                                ? 'Online'
                                : 'Starting'}
                        </div>
                    </div>
                    <div className={'mobile-only mt-2'}>
                        {stats && !isSuspended && (
                            <div className={'mobile-metrics'}>
                                <span>
                                    <Icon icon={faMicrochip} $alarm={alarms.cpu} />
                                    {stats.cpuUsagePercent.toFixed(0)}%
                                </span>
                                <span>
                                    <Icon icon={faMemory} $alarm={alarms.memory} />
                                    {bytesToString(stats.memoryUsageInBytes)}
                                </span>
                                <span>
                                    <Icon icon={faHdd} $alarm={alarms.disk} />
                                    {bytesToString(stats.diskUsageInBytes)}
                                </span>
                            </div>
                        )}
                        <div className={'mobile-details'}>
                            <span>
                                {server.allocations
                                    .filter((alloc) => alloc.isDefault)
                                    .map((allocation) => (
                                        <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                            {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                        </React.Fragment>
                                    ))}
                            </span>
                            <span>{server.node}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Server Info Grid */}
            <div className='section-middle hidden sm:block'>
                <div css={tw`grid grid-cols-1 gap-2`}>
                    {/* Endpoint */}
                    <div className='info-card'>
                        <div css={tw`flex items-center gap-2 mb-1`}>
                            <FontAwesomeIcon icon={faEthernet} css={tw`text-accent-blue text-[10px]`} />
                            <span
                                css={tw`text-[10px] font-black uppercase tracking-widest`}
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Connection Endpoint
                            </span>
                        </div>
                        <p
                            css={tw`text-sm font-mono font-bold truncate`}
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {server.allocations
                                .filter((alloc) => alloc.isDefault)
                                .map((allocation) => (
                                    <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                        {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                    </React.Fragment>
                                ))}
                        </p>
                    </div>

                    {/* Node & Networks */}
                    <div css={tw`grid grid-cols-2 gap-2`}>
                        <div className='info-card'>
                            <div css={tw`flex items-center gap-2 mb-1`}>
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    css={tw`text-[10px]`}
                                    style={{ color: 'var(--text-secondary)' }}
                                />
                                <span
                                    css={tw`text-[10px] font-black uppercase tracking-widest`}
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Node
                                </span>
                            </div>
                            <p
                                css={tw`text-xs font-bold truncate`}
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {server.node}
                            </p>
                        </div>
                        <div className='info-card'>
                            <div css={tw`flex items-center gap-2 mb-1`}>
                                <FontAwesomeIcon
                                    icon={faGlobe}
                                    css={tw`text-[10px]`}
                                    style={{ color: 'var(--text-secondary)' }}
                                />
                                <span
                                    css={tw`text-[10px] font-black uppercase tracking-widest`}
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Networks
                                </span>
                            </div>
                            <p
                                css={tw`text-xs font-bold`}
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {server.allocations.length} allocated
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Stats */}
            <div className='section-right hidden sm:block'>
                {!stats || isSuspended ? (
                    <div css={tw`flex items-center justify-center h-full`}>
                        {isSuspended ? (
                            <span
                                css={tw`rounded-xl px-4 py-2 text-xs font-black inline-flex items-center gap-2`}
                                style={{
                                    backgroundColor: 'var(--status-error-bg)',
                                    color: 'var(--status-error-text)',
                                    border: '1px solid var(--status-error-border)',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={server.status === 'suspended' ? faExclamationTriangle : faTimesCircle}
                                />
                                {server.status === 'suspended' ? 'Suspended' : 'Error'}
                            </span>
                        ) : server.isTransferring || server.status ? (
                            <span
                                css={tw`rounded-xl px-4 py-2 text-xs font-black inline-flex items-center gap-2`}
                                style={{
                                    backgroundColor: 'var(--bg-tertiary)',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border-primary)',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={
                                        server.isTransferring
                                            ? faBoxOpen
                                            : server.status === 'installing'
                                            ? faCog
                                            : server.status === 'restoring_backup'
                                            ? faHistory
                                            : faPauseCircle
                                    }
                                />
                                {server.isTransferring
                                    ? 'Transferring'
                                    : server.status === 'installing'
                                    ? 'Installing'
                                    : server.status === 'restoring_backup'
                                    ? 'Restoring'
                                    : 'Unavailable'}
                            </span>
                        ) : (
                            <Spinner size={'small'} />
                        )}
                    </div>
                ) : (
                    <div css={tw`flex flex-col md:flex-row items-center gap-6`}>
                        {/* CPU */}
                        <div css={tw`flex-1 w-full md:w-28`}>
                            <div css={tw`flex items-center justify-between mb-1.5`}>
                                <div css={tw`flex items-center gap-2`}>
                                    <Icon icon={faMicrochip} $alarm={alarms.cpu} css={tw`text-[10px]`} />
                                    <span
                                        css={tw`text-[10px] font-black uppercase tracking-widest`}
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        CPU
                                    </span>
                                </div>
                                <span
                                    css={tw`text-[11px] font-black`}
                                    style={{ color: alarms.cpu ? '#EF4444' : 'var(--text-primary)' }}
                                >
                                    {stats.cpuUsagePercent.toFixed(0)}%
                                </span>
                            </div>
                            <div
                                css={tw`w-full h-1.5 rounded-full overflow-hidden`}
                                style={{ backgroundColor: 'var(--bg-progress-track)' }}
                            >
                                <div
                                    css={tw`h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stats.cpuUsagePercent / (server.limits.cpu || 100)) * 100,
                                            100
                                        )}%`,
                                        background: alarms.cpu ? '#EF4444' : 'linear-gradient(90deg, #EC4899, #7C3AED)',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Memory */}
                        <div css={tw`flex-1 w-full md:w-28`}>
                            <div css={tw`flex items-center justify-between mb-1.5`}>
                                <div css={tw`flex items-center gap-2`}>
                                    <Icon icon={faMemory} $alarm={alarms.memory} css={tw`text-[10px]`} />
                                    <span
                                        css={tw`text-[10px] font-black uppercase tracking-widest`}
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        RAM
                                    </span>
                                </div>
                                <span
                                    css={tw`text-[11px] font-black`}
                                    style={{ color: alarms.memory ? '#EF4444' : 'var(--text-primary)' }}
                                >
                                    {bytesToString(stats.memoryUsageInBytes)}
                                </span>
                            </div>
                            <div
                                css={tw`w-full h-1.5 rounded-full overflow-hidden`}
                                style={{ backgroundColor: 'var(--bg-progress-track)' }}
                            >
                                <div
                                    css={tw`h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stats.memoryUsageInBytes / mbToBytes(server.limits.memory || 1024)) * 100,
                                            100
                                        )}%`,
                                        background: alarms.memory
                                            ? '#EF4444'
                                            : 'linear-gradient(90deg, #EC4899, #7C3AED)',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Disk */}
                        <div css={tw`flex-1 w-full md:w-28`}>
                            <div css={tw`flex items-center justify-between mb-1.5`}>
                                <div css={tw`flex items-center gap-2`}>
                                    <Icon icon={faHdd} $alarm={alarms.disk} css={tw`text-[10px]`} />
                                    <span
                                        css={tw`text-[10px] font-black uppercase tracking-widest`}
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        DISK
                                    </span>
                                </div>
                                <span
                                    css={tw`text-[11px] font-black`}
                                    style={{ color: alarms.disk ? '#EF4444' : 'var(--text-primary)' }}
                                >
                                    {bytesToString(stats.diskUsageInBytes)}
                                </span>
                            </div>
                            <div
                                css={tw`w-full h-1.5 rounded-full overflow-hidden`}
                                style={{ backgroundColor: 'var(--bg-progress-track)' }}
                            >
                                <div
                                    css={tw`h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stats.diskUsageInBytes / mbToBytes(server.limits.disk || 1024)) * 100,
                                            100
                                        )}%`,
                                        background: alarms.disk
                                            ? '#EF4444'
                                            : 'linear-gradient(90deg, #EC4899, #7C3AED)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StatusIndicatorBox>
    );
};
