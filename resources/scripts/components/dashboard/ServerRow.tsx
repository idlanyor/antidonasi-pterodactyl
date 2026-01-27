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
        ${(props) => (props.$alarm ? 'color: #ef4444;' : 'color: #3b82f6;')};
    `,
    isEqual
);

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(1); }
`;

const StatusIndicatorBox = styled(GreyRowBox)<{ $status: ServerPowerState | undefined }>`
    ${tw`relative flex flex-col lg:flex-row lg:items-stretch`};
    ${tw`rounded-xl p-0 transition-all duration-200`};
    ${tw`bg-neutral-900 border border-neutral-800`};
    overflow: hidden;

    &:hover {
        ${tw`border-neutral-700 bg-neutral-900`};
        transform: translateY(-1px);
    }

    @media (max-width: 1023px) {
        gap: 0;
    }

    & .status-badge {
        ${tw`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5`};
        ${({ $status }) => {
            if (!$status || $status === 'offline') {
                return 'background-color: rgba(239, 68, 68, 0.12); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35);';
            }
            if ($status === 'running') {
                return 'background-color: rgba(34, 197, 94, 0.12); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.35);';
            }
            return 'background-color: rgba(234, 179, 8, 0.12); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.35);';
        }};
    }

    & .status-dot {
        ${tw`w-1.5 h-1.5 rounded-full`};
        animation: ${pulse} 2s ease-in-out infinite;
        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-red-500`
                : $status === 'running'
                ? tw`bg-green-500`
                : tw`bg-yellow-500`};
    }

    & .section-left {
        ${tw`flex items-center gap-3 p-3 lg:p-4 lg:w-64 lg:flex-shrink-0`};
        ${tw`border-b lg:border-b-0 lg:border-r border-neutral-800`};
    }

    & .section-middle {
        ${tw`flex-1 p-3 lg:p-4 bg-transparent`};
    }

    & .section-right {
        ${tw`p-3 lg:p-4 lg:w-[400px] lg:flex-shrink-0`};
        ${tw`border-t lg:border-t-0 lg:border-l border-neutral-800`};
    }

    & .info-card {
        ${tw`px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700`};
    }

    & .stat-item {
        ${tw`flex-1 min-w-0`};
    }

    & .mobile-main {
        ${tw`w-full flex items-center justify-between gap-3`};
    }

    & .mobile-metrics {
        ${tw`flex items-center gap-2 text-[11px] font-semibold text-neutral-300`};

        & span {
            ${tw`flex items-center gap-1`};
        }
    }

    & .mobile-details {
        ${tw`mt-2 grid grid-cols-2 gap-2 text-[11px] text-neutral-400`};
    }

    & .desktop-main {
        ${tw`hidden sm:block`};
    }

    & .mobile-only {
        ${tw`block sm:hidden`};
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

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

    return (
        <StatusIndicatorBox as={Link} to={`/server/${server.id}`} className={className} $status={stats?.status}>
            {/* Left Section: Icon + Name */}
            <div className='section-left'>
                <div
                    css={tw`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg flex-shrink-0 bg-neutral-900 border border-neutral-700`}
                >
                    <FontAwesomeIcon icon={faServer} css={tw`text-neutral-400 text-[11px]`} />
                </div>
                <div css={tw`flex-1 min-w-0`}>
                    <div className={'desktop-main'}>
                        <p css={tw`text-sm font-bold truncate mb-0.5 text-neutral-100`}>{server.name}</p>
                        <div className={'status-badge'}>
                            <div className={'status-dot'} />
                            {!stats?.status || stats.status === 'offline'
                                ? 'Offline'
                                : stats.status === 'running'
                                ? 'Online'
                                : 'Starting'}
                        </div>
                    </div>
                    <div className={'mobile-only'}>
                        <div className={'mobile-main'}>
                            <div css={tw`min-w-0`}>
                                <p css={tw`text-sm font-bold truncate mb-0.5 text-neutral-100`}>{server.name}</p>
                                <div className={'status-badge'}>
                                    <div className={'status-dot'} />
                                    {!stats?.status || stats.status === 'offline'
                                        ? 'Offline'
                                        : stats.status === 'running'
                                        ? 'Online'
                                        : 'Starting'}
                                </div>
                            </div>
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
                        </div>
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
                            <span>{server.allocations.length} allocated</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Server Info Grid */}
            <div className='section-middle hidden sm:block'>
                <div css={tw`grid grid-cols-1 sm:grid-cols-3 gap-2`}>
                    {/* Endpoint */}
                    <div className='info-card'>
                        <div css={tw`flex items-center gap-1.5 mb-1`}>
                            <FontAwesomeIcon icon={faEthernet} css={tw`text-blue-400 text-[10px]`} />
                            <span css={tw`text-[10px] font-bold uppercase tracking-wider text-neutral-500`}>
                                Endpoint
                            </span>
                        </div>
                        <p css={tw`text-xs font-mono font-medium truncate text-neutral-300`}>
                            {server.allocations
                                .filter((alloc) => alloc.isDefault)
                                .map((allocation) => (
                                    <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                        {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                    </React.Fragment>
                                ))}
                        </p>
                    </div>

                    {/* Node */}
                    <div className='info-card hidden sm:block'>
                        <div css={tw`flex items-center gap-1.5 mb-1`}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} css={tw`text-[10px] text-neutral-500`} />
                            <span css={tw`text-[10px] font-bold uppercase tracking-wider text-neutral-500`}>Node</span>
                        </div>
                        <p css={tw`text-xs font-medium truncate text-neutral-300`}>{server.node}</p>
                    </div>

                    {/* Allocations */}
                    <div className='info-card hidden sm:block'>
                        <div css={tw`flex items-center gap-1.5 mb-1`}>
                            <FontAwesomeIcon icon={faGlobe} css={tw`text-[10px] text-neutral-500`} />
                            <span css={tw`text-[10px] font-bold uppercase tracking-wider text-neutral-500`}>
                                Networks
                            </span>
                        </div>
                        <p css={tw`text-xs font-medium text-neutral-300`}>{server.allocations.length} allocated</p>
                    </div>
                </div>
            </div>

            {/* Right Section: Stats */}
            <div className='section-right hidden sm:block'>
                {!stats || isSuspended ? (
                    <div css={tw`flex items-center justify-center h-full`}>
                        {isSuspended ? (
                            <span
                                css={tw`rounded-lg px-3 py-2 text-xs font-semibold bg-red-500 bg-opacity-10 text-red-400 border border-red-500 border-opacity-20 inline-flex items-center gap-2`}
                            >
                                <FontAwesomeIcon
                                    icon={server.status === 'suspended' ? faExclamationTriangle : faTimesCircle}
                                />
                                {server.status === 'suspended' ? 'Suspended' : 'Error'}
                            </span>
                        ) : server.isTransferring || server.status ? (
                            <span
                                css={tw`rounded-lg px-3 py-2 text-xs font-semibold bg-neutral-700 bg-opacity-50 text-neutral-400 border border-neutral-600 inline-flex items-center gap-2`}
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
                    <div css={tw`grid grid-cols-1 sm:grid-cols-3 gap-3`}>
                        {/* CPU */}
                        <div className='stat-item'>
                            <div css={tw`flex items-center justify-between mb-1`}>
                                <div css={tw`flex items-center gap-1.5`}>
                                    <Icon icon={faMicrochip} $alarm={alarms.cpu} css={tw`text-[10px]`} />
                                    <span css={tw`text-[10px] font-bold uppercase tracking-wider text-neutral-500`}>
                                        CPU
                                    </span>
                                </div>
                                <span
                                    css={[tw`text-xs font-bold`, alarms.cpu ? tw`text-red-400` : tw`text-neutral-200`]}
                                >
                                    {stats.cpuUsagePercent.toFixed(0)}%
                                </span>
                            </div>
                            <div css={tw`w-full h-1.5 rounded-full overflow-hidden bg-neutral-900`}>
                                <div
                                    css={tw`h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stats.cpuUsagePercent / (server.limits.cpu || 100)) * 100,
                                            100
                                        )}%`,
                                        background: alarms.cpu ? '#ef4444' : '#3b82f6',
                                    }}
                                />
                            </div>
                            <div css={tw`text-[10px] mt-1 font-medium text-neutral-600 uppercase tracking-tight`}>
                                limit: {cpuLimit}
                            </div>
                        </div>

                        {/* Memory */}
                        <div className='stat-item'>
                            <div css={tw`flex items-center justify-between mb-1`}>
                                <div css={tw`flex items-center gap-1.5`}>
                                    <Icon icon={faMemory} $alarm={alarms.memory} css={tw`text-[10px]`} />
                                    <span css={tw`text-[10px] font-bold uppercase tracking-wider text-neutral-500`}>
                                        RAM
                                    </span>
                                </div>
                                <span
                                    css={[
                                        tw`text-xs font-bold`,
                                        alarms.memory ? tw`text-red-400` : tw`text-neutral-200`,
                                    ]}
                                >
                                    {bytesToString(stats.memoryUsageInBytes)}
                                </span>
                            </div>
                            <div css={tw`w-full h-1.5 rounded-full overflow-hidden bg-neutral-900`}>
                                <div
                                    css={tw`h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stats.memoryUsageInBytes / mbToBytes(server.limits.memory || 1024)) * 100,
                                            100
                                        )}%`,
                                        background: alarms.memory ? '#ef4444' : '#3b82f6',
                                    }}
                                />
                            </div>
                            <div css={tw`text-[10px] mt-1 font-medium text-neutral-600 uppercase tracking-tight`}>
                                limit: {memoryLimit}
                            </div>
                        </div>

                        {/* Disk */}
                        <div className='stat-item'>
                            <div css={tw`flex items-center justify-between mb-1`}>
                                <div css={tw`flex items-center gap-1.5`}>
                                    <Icon icon={faHdd} $alarm={alarms.disk} css={tw`text-[10px]`} />
                                    <span css={tw`text-[10px] font-bold uppercase tracking-wider text-neutral-500`}>
                                        Disk
                                    </span>
                                </div>
                                <span
                                    css={[tw`text-xs font-bold`, alarms.disk ? tw`text-red-400` : tw`text-neutral-200`]}
                                >
                                    {bytesToString(stats.diskUsageInBytes)}
                                </span>
                            </div>
                            <div css={tw`w-full h-1.5 rounded-full overflow-hidden bg-neutral-900`}>
                                <div
                                    css={tw`h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stats.diskUsageInBytes / mbToBytes(server.limits.disk || 1024)) * 100,
                                            100
                                        )}%`,
                                        background: alarms.disk ? '#ef4444' : '#3b82f6',
                                    }}
                                />
                            </div>
                            <div css={tw`text-[10px] mt-1 font-medium text-neutral-600 uppercase tracking-tight`}>
                                limit: {diskLimit}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StatusIndicatorBox>
    );
};
