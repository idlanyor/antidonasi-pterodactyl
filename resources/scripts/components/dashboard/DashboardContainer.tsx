import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const [query] = useState('');
    const [sortKey] = useState<'nameAsc' | 'nameDesc' | 'status'>('nameAsc');
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            {/* Header Section */}
            <div
                css={tw`mb-6 p-6 rounded-xl`}
                style={{
                    background:
                        'linear-gradient(135deg, rgba(245, 133, 41, 0.15), rgba(221, 42, 123, 0.12), rgba(129, 52, 175, 0.1))',
                    border: '2px solid rgba(245, 133, 41, 0.3)',
                    boxShadow: '0 8px 25px rgba(245, 133, 41, 0.2)',
                }}
            >
                {/* Search and Filter Controls */}
                <div css={tw`flex flex-wrap gap-3`}>
                    {rootAdmin && (
                        <div
                            css={tw`flex items-center gap-3 px-4 py-2 rounded-lg`}
                            style={{
                                background: 'rgba(255, 255, 255, 0.7)',
                                border: '2px solid rgba(129, 52, 175, 0.3)',
                            }}
                        >
                            <p
                                css={tw`text-xs font-semibold`}
                                style={{
                                    color: '#8134af',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                {showOnlyAdmin ? '🌐 All Servers' : '👤 My Servers'}
                            </p>
                            <Switch
                                name={'show_all_servers'}
                                defaultChecked={showOnlyAdmin}
                                onChange={() => setShowOnlyAdmin((s) => !s)}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* Server List */}
            {!servers ? (
                <div css={tw`flex justify-center items-center py-20`}>
                    <Spinner centered size={'large'} />
                </div>
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) => {
                        const filtered = items.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()));
                        const sorted = filtered.sort((a, b) => {
                            if (sortKey === 'nameAsc') return a.name.localeCompare(b.name);
                            if (sortKey === 'nameDesc') return b.name.localeCompare(a.name);
                            // status sort: running first, then others, offline last
                            const rank = (st?: string) => (st === 'running' ? 0 : st ? 1 : 2);
                            return rank(a.status as any) - rank(b.status as any);
                        });
                        return sorted.length > 0 ? (
                            <div css={tw`flex flex-col gap-3`}>
                                {sorted.map((server, index) => (
                                    <div
                                        key={server.uuid}
                                        style={{
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                                        }}
                                    >
                                        <ServerRow server={server} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                css={tw`flex flex-col items-center justify-center py-20 px-4 rounded-xl`}
                                style={{
                                    background:
                                        'linear-gradient(135deg, rgba(245, 133, 41, 0.1), rgba(221, 42, 123, 0.08))',
                                    border: '2px dashed rgba(245, 133, 41, 0.3)',
                                }}
                            >
                                <div
                                    css={tw`text-6xl mb-4`}
                                    style={{
                                        filter: 'grayscale(1) opacity(0.5)',
                                    }}
                                >
                                    📦
                                </div>
                                <p
                                    css={tw`text-xl font-bold mb-2`}
                                    style={{
                                        color: '#2d3748',
                                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                    }}
                                >
                                    No Servers Found
                                </p>
                                <p
                                    css={tw`text-sm text-center`}
                                    style={{
                                        color: 'rgba(0, 0, 0, 0.6)',
                                        maxWidth: '400px',
                                    }}
                                >
                                    {showOnlyAdmin
                                        ? 'No other servers are available to display.'
                                        : query
                                        ? `No servers match your search "${query}"`
                                        : "You don't have any servers yet."}
                                </p>
                            </div>
                        );
                    }}
                </Pagination>
            )}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </PageContentBlock>
    );
};
