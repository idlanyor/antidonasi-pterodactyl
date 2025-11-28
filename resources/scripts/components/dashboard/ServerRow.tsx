import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
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
        ${(props) => (props.$alarm ? 'color: #fc8181;' : 'color: #f58529;')};
    `,
    isEqual
);

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(1); box-shadow: 0 0 10px currentColor; }
  50% { opacity: 1; transform: scale(1.15); box-shadow: 0 0 20px currentColor; }
  100% { opacity: 0.6; transform: scale(1); box-shadow: 0 0 10px currentColor; }
`;

const StatusIndicatorBox = styled(GreyRowBox)<{ $status: ServerPowerState | undefined }>`
    ${tw`relative flex flex-col lg:flex-row lg:items-stretch`};
    ${tw`rounded-xl p-0`};
    background: rgba(255, 255, 255, 0.98) !important;
    border: 1.5px solid rgba(245, 133, 41, 0.2) !important;
    box-shadow: 0 4px 20px rgba(245, 133, 41, 0.12), 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    &:hover {
        border-color: rgba(245, 133, 41, 0.4) !important;
        box-shadow: 0 8px 30px rgba(245, 133, 41, 0.2), 0 4px 12px rgba(221, 42, 123, 0.1);
        transform: translateY(-2px);
    }

    @media (max-width: 1023px) {
        gap: 0;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #f58529, #dd2a7b, #8134af);
    }

    & .status-badge {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
        ${({ $status }) =>
            !$status || $status === 'offline'
                ? `background: rgba(239, 68, 68, 0.12); 
                   color: #dc2626; 
                   border: 1.5px solid rgba(239, 68, 68, 0.25);`
                : $status === 'running'
                ? `background: rgba(16, 185, 129, 0.12); 
                   color: #059669; 
                   border: 1.5px solid rgba(16, 185, 129, 0.25);`
                : `background: rgba(245, 158, 11, 0.12); 
                   color: #d97706; 
                   border: 1.5px solid rgba(245, 158, 11, 0.25);`};
    }

    & .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 9999px;
        animation: ${pulse} 1.5s ease-in-out infinite;
        ${({ $status }) =>
            !$status || $status === 'offline'
                ? 'background: #ef4444;'
                : $status === 'running'
                ? 'background: #10b981;'
                : 'background: #f59e0b;'};
    }

    & .section-left {
        ${tw`flex items-center gap-3 p-4`};
        background: linear-gradient(135deg, rgba(245, 133, 41, 0.04), rgba(221, 42, 123, 0.02));
        border-right: 1px solid rgba(245, 133, 41, 0.1);
        @media (max-width: 1023px) {
            border-right: none;
            border-bottom: 1px solid rgba(245, 133, 41, 0.1);
        }
    }

    & .section-middle {
        ${tw`flex-1 p-4`};
        background: rgba(255, 255, 255, 0.5);
    }

    & .section-right {
        ${tw`p-4`};
        background: linear-gradient(135deg, rgba(129, 52, 175, 0.03), rgba(221, 42, 123, 0.02));
        border-left: 1px solid rgba(129, 52, 175, 0.1);
        @media (max-width: 1023px) {
            border-left: none;
            border-top: 1px solid rgba(129, 52, 175, 0.1);
        }
    }

    & .info-card {
        ${tw`px-3 py-2.5 rounded-lg`};
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    & .stat-item {
        ${tw`flex-1 min-w-0`};
    }

    @media (min-width: 1024px) {
        & .section-left {
            width: 240px;
            flex-shrink: 0;
        }
        & .section-right {
            width: 400px;
            flex-shrink: 0;
        }
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
        <StatusIndicatorBox
            as={Link}
            to={`/server/${server.id}`}
            className={className}
            $status={stats?.status}
            $variant={'glass'}
            style={{
                ['--card-grad-start' as any]: 'rgba(245, 133, 41, 0.12)',
                ['--card-grad-end' as any]: 'rgba(129, 52, 175, 0.10)',
            }}
        >
            {/* Left Section: Icon + Name */}
            <div className='section-left'>
                <div
                    css={tw`flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0`}
                    style={{
                        background: 'linear-gradient(135deg, #f58529, #dd2a7b)',
                        boxShadow: '0 4px 12px rgba(245, 133, 41, 0.3)',
                    }}
                >
                    <FontAwesomeIcon
                        icon={faServer}
                        style={{
                            color: '#ffffff',
                            fontSize: '16px',
                        }}
                    />
                </div>
                <div css={tw`flex-1 min-w-0`}>
                    <p
                        css={tw`text-sm font-bold truncate mb-1`}
                        style={{
                            color: '#1a202c',
                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        }}
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
            </div>

            {/* Middle Section: Server Info Grid */}
            <div className='section-middle'>
                <div css={tw`grid grid-cols-1 sm:grid-cols-3 gap-2`}>
                    {/* Endpoint */}
                    <div className='info-card'>
                        <div css={tw`flex items-center gap-1.5 mb-1`}>
                            <FontAwesomeIcon icon={faEthernet} style={{ color: '#8134af', fontSize: '11px' }} />
                            <span css={tw`text-2xs font-semibold uppercase tracking-wide`} style={{ color: '#718096' }}>
                                Endpoint
                            </span>
                        </div>
                        <p css={tw`text-xs font-mono font-bold truncate`} style={{ color: '#2d3748' }}>
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
                    <div className='info-card'>
                        <div css={tw`flex items-center gap-1.5 mb-1`}>
                            <span style={{ fontSize: '11px' }}>📍</span>
                            <span css={tw`text-2xs font-semibold uppercase tracking-wide`} style={{ color: '#718096' }}>
                                Node
                            </span>
                        </div>
                        <p css={tw`text-xs font-bold truncate`} style={{ color: '#2d3748' }}>
                            {server.node}
                        </p>
                    </div>

                    {/* Allocations */}
                    <div className='info-card'>
                        <div css={tw`flex items-center gap-1.5 mb-1`}>
                            <span style={{ fontSize: '11px' }}>🌐</span>
                            <span css={tw`text-2xs font-semibold uppercase tracking-wide`} style={{ color: '#718096' }}>
                                Networks
                            </span>
                        </div>
                        <p css={tw`text-xs font-bold`} style={{ color: '#2d3748' }}>
                            {server.allocations.length} allocated
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section: Stats */}
            <div className='section-right'>
                {!stats || isSuspended ? (
                    <div css={tw`flex items-center justify-center h-full`}>
                        {isSuspended ? (
                            <span
                                css={tw`rounded-lg px-3 py-2 text-xs font-semibold`}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#dc2626',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                }}
                            >
                                {server.status === 'suspended' ? '⚠️ Suspended' : '❌ Error'}
                            </span>
                        ) : server.isTransferring || server.status ? (
                            <span
                                css={tw`rounded-lg px-3 py-2 text-xs font-semibold`}
                                style={{
                                    background: 'rgba(156, 163, 175, 0.1)',
                                    color: '#6b7280',
                                    border: '1px solid rgba(156, 163, 175, 0.2)',
                                }}
                            >
                                {server.isTransferring
                                    ? '📦 Transferring'
                                    : server.status === 'installing'
                                    ? '⚙️ Installing'
                                    : server.status === 'restoring_backup'
                                    ? '💾 Restoring'
                                    : '⏸️ Unavailable'}
                            </span>
                        ) : (
                            <Spinner size={'small'} />
                        )}
                    </div>
                ) : (
                    <div css={tw`grid grid-cols-1 sm:grid-cols-3 gap-3`}>
                        {/* CPU */}
                        <div className='stat-item'>
                            <div css={tw`flex items-center justify-between mb-1.5`}>
                                <div css={tw`flex items-center gap-1.5`}>
                                    <Icon icon={faMicrochip} $alarm={alarms.cpu} css={tw`text-xs`} />
                                    <span
                                        css={tw`text-2xs font-semibold uppercase tracking-wide`}
                                        style={{ color: '#718096' }}
                                    >
                                        CPU
                                    </span>
                                </div>
                                <span css={tw`text-xs font-bold`} style={{ color: alarms.cpu ? '#dc2626' : '#2d3748' }}>
                                    {stats.cpuUsagePercent.toFixed(0)}%
                                </span>
                            </div>
                            <div
                                css={tw`w-full h-2.5 rounded-full overflow-hidden`}
                                style={{ background: 'rgba(0, 0, 0, 0.06)' }}
                            >
                                <div
                                    css={tw`h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stats.cpuUsagePercent / (server.limits.cpu || 100)) * 100,
                                            100
                                        )}%`,
                                        background: alarms.cpu
                                            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                                            : 'linear-gradient(90deg, #f58529, #dd2a7b)',
                                    }}
                                />
                            </div>
                            <div css={tw`text-2xs mt-1 font-medium`} style={{ color: '#a0aec0' }}>
                                of {cpuLimit}
                            </div>
                        </div>

                        {/* Memory */}
                        <div className='stat-item'>
                            <div css={tw`flex items-center justify-between mb-1.5`}>
                                <div css={tw`flex items-center gap-1.5`}>
                                    <Icon icon={faMemory} $alarm={alarms.memory} css={tw`text-xs`} />
                                    <span
                                        css={tw`text-2xs font-semibold uppercase tracking-wide`}
                                        style={{ color: '#718096' }}
                                    >
                                        RAM
                                    </span>
                                </div>
                                <span
                                    css={tw`text-xs font-bold`}
                                    style={{ color: alarms.memory ? '#dc2626' : '#2d3748' }}
                                >
                                    {bytesToString(stats.memoryUsageInBytes)}
                                </span>
                            </div>
                            <div
                                css={tw`w-full h-2.5 rounded-full overflow-hidden`}
                                style={{ background: 'rgba(0, 0, 0, 0.06)' }}
                            >
                                <div
                                    css={tw`h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stats.memoryUsageInBytes / mbToBytes(server.limits.memory || 1024)) * 100,
                                            100
                                        )}%`,
                                        background: alarms.memory
                                            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                                            : 'linear-gradient(90deg, #dd2a7b, #8134af)',
                                    }}
                                />
                            </div>
                            <div css={tw`text-2xs mt-1 font-medium`} style={{ color: '#a0aec0' }}>
                                of {memoryLimit}
                            </div>
                        </div>

                        {/* Disk */}
                        <div className='stat-item'>
                            <div css={tw`flex items-center justify-between mb-1.5`}>
                                <div css={tw`flex items-center gap-1.5`}>
                                    <Icon icon={faHdd} $alarm={alarms.disk} css={tw`text-xs`} />
                                    <span
                                        css={tw`text-2xs font-semibold uppercase tracking-wide`}
                                        style={{ color: '#718096' }}
                                    >
                                        Disk
                                    </span>
                                </div>
                                <span
                                    css={tw`text-xs font-bold`}
                                    style={{ color: alarms.disk ? '#dc2626' : '#2d3748' }}
                                >
                                    {bytesToString(stats.diskUsageInBytes)}
                                </span>
                            </div>
                            <div
                                css={tw`w-full h-2.5 rounded-full overflow-hidden`}
                                style={{ background: 'rgba(0, 0, 0, 0.06)' }}
                            >
                                <div
                                    css={tw`h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${Math.min(
                                            (stats.diskUsageInBytes / mbToBytes(server.limits.disk || 1024)) * 100,
                                            100
                                        )}%`,
                                        background: alarms.disk
                                            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                                            : 'linear-gradient(90deg, #8134af, #6d28d9)',
                                    }}
                                />
                            </div>
                            <div css={tw`text-2xs mt-1 font-medium`} style={{ color: '#a0aec0' }}>
                                of {diskLimit}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StatusIndicatorBox>
    );
};
