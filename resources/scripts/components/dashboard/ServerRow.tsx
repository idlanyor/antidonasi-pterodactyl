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
        ${(props) => (props.$alarm ? 'color: #ff3333;' : 'color: #ffd700;')};
        filter: ${(props) =>
            props.$alarm
                ? 'drop-shadow(0 0 6px rgba(255, 51, 51, 0.6))'
                : 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))'};
    `,
    isEqual
);

const IconDescription = styled.p<{ $alarm: boolean }>`
    ${tw`text-sm ml-2`};
    ${(props) =>
        props.$alarm
            ? 'color: #ff3333; text-shadow: 0 0 8px rgba(255, 51, 51, 0.5);'
            : 'color: #ffd700; text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);'};
    font-family: monospace;
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(1); box-shadow: 0 0 10px currentColor; }
  50% { opacity: 1; transform: scale(1.15); box-shadow: 0 0 20px currentColor; }
  100% { opacity: 0.6; transform: scale(1); box-shadow: 0 0 10px currentColor; }
`;

const glitchFlicker = keyframes`
    0%, 100% { opacity: 1; }
    96% { opacity: 1; }
    97% { opacity: 0.9; transform: translateX(-1px); }
    98% { opacity: 1; transform: translateX(0); }
    99% { opacity: 0.95; transform: translateX(0.5px); }
`;

const StatusIndicatorBox = styled(GreyRowBox)<{ $status: ServerPowerState | undefined }>`
    ${tw`relative flex flex-col space-y-3`};
    ${tw`rounded-lg p-5`};
    background: rgba(20, 10, 10, 0.85) !important;
    border: 1px solid rgba(255, 215, 0, 0.3) !important;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.15), 0 0 40px rgba(255, 51, 51, 0.1);
    animation: ${glitchFlicker} 12s infinite;
    transition: all 0.3s ease;

    &:hover {
        border-color: rgba(255, 215, 0, 0.6) !important;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3), 0 0 60px rgba(255, 51, 51, 0.2);
        transform: translateY(-3px);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #ffd700, #ff3333, transparent);
        opacity: 0.6;
    }

    & .status-dot {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 12px;
        height: 12px;
        border-radius: 9999px;
        animation: ${pulse} 1.4s ease-in-out infinite;
        ${({ $status }) =>
            !$status || $status === 'offline'
                ? 'background: #ff3333; box-shadow: 0 0 15px rgba(255, 51, 51, 0.8);'
                : $status === 'running'
                ? 'background: #00ff88; box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);'
                : 'background: #ffff00; box-shadow: 0 0 15px rgba(255, 255, 0, 0.8);'};
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
            $animated
            style={{
                ['--card-grad-start' as any]: 'rgba(59, 130, 246, 0.12)',
                ['--card-grad-end' as any]: 'rgba(16, 185, 129, 0.10)',
            }}
        >
            {/* Header: icon + name + description */}
            <div css={tw`flex items-center`}>
                <div
                    className={'icon mr-4'}
                    style={{
                        color: '#ffd700',
                        filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
                    }}
                >
                    <FontAwesomeIcon icon={faServer} />
                </div>
                <div css={tw`flex-1 min-w-0`}>
                    <p
                        css={tw`text-lg break-words font-bold`}
                        style={{
                            color: '#ffd700',
                            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                            fontFamily: 'monospace',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {server.name}
                    </p>
                    {!!server.description && (
                        <p
                            css={tw`text-sm break-words line-clamp-2`}
                            style={{
                                color: 'rgba(255, 215, 0, 0.7)',
                                fontFamily: 'monospace',
                            }}
                        >
                            {server.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Endpoint */}
            <div css={tw`flex items-center text-sm`}>
                <FontAwesomeIcon
                    icon={faEthernet}
                    style={{
                        color: '#ff3333',
                        filter: 'drop-shadow(0 0 6px rgba(255, 51, 51, 0.6))',
                    }}
                />
                <p
                    css={tw`ml-2 truncate`}
                    style={{
                        color: '#ff3333',
                        textShadow: '0 0 8px rgba(255, 51, 51, 0.4)',
                        fontFamily: 'monospace',
                    }}
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

            {/* Stats or status */}
            <div>
                {!stats || isSuspended ? (
                    isSuspended ? (
                        <div css={tw`text-center`}>
                            <span css={tw`bg-red-500 rounded px-2 py-1 text-red-100 text-xs`}>
                                {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
                            </span>
                        </div>
                    ) : server.isTransferring || server.status ? (
                        <div css={tw`text-center`}>
                            <span css={tw`bg-neutral-500 rounded px-2 py-1 text-neutral-100 text-xs`}>
                                {server.isTransferring
                                    ? 'Transferring'
                                    : server.status === 'installing'
                                    ? 'Installing'
                                    : server.status === 'restoring_backup'
                                    ? 'Restoring Backup'
                                    : 'Unavailable'}
                            </span>
                        </div>
                    ) : (
                        <Spinner size={'small'} />
                    )
                ) : (
                    <div css={tw`grid grid-cols-3 gap-4`}>
                        <div>
                            <div css={tw`flex justify-center`}>
                                <Icon icon={faMicrochip} $alarm={alarms.cpu} />
                                <IconDescription $alarm={alarms.cpu}>
                                    {stats.cpuUsagePercent.toFixed(2)} %
                                </IconDescription>
                            </div>
                            <p
                                css={tw`text-2xs text-center mt-1`}
                                style={{ color: 'rgba(255, 215, 0, 0.5)', fontFamily: 'monospace' }}
                            >
                                of {cpuLimit}
                            </p>
                        </div>
                        <div>
                            <div css={tw`flex justify-center`}>
                                <Icon icon={faMemory} $alarm={alarms.memory} />
                                <IconDescription $alarm={alarms.memory}>
                                    {bytesToString(stats.memoryUsageInBytes)}
                                </IconDescription>
                            </div>
                            <p
                                css={tw`text-2xs text-center mt-1`}
                                style={{ color: 'rgba(255, 215, 0, 0.5)', fontFamily: 'monospace' }}
                            >
                                of {memoryLimit}
                            </p>
                        </div>
                        <div>
                            <div css={tw`flex justify-center`}>
                                <Icon icon={faHdd} $alarm={alarms.disk} />
                                <IconDescription $alarm={alarms.disk}>
                                    {bytesToString(stats.diskUsageInBytes)}
                                </IconDescription>
                            </div>
                            <p
                                css={tw`text-2xs text-center mt-1`}
                                style={{ color: 'rgba(255, 215, 0, 0.5)', fontFamily: 'monospace' }}
                            >
                                of {diskLimit}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <div className={'status-dot'} />
        </StatusIndicatorBox>
    );
};
