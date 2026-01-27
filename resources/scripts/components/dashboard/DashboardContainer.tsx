import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';
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
import styled from 'styled-components/macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';

const HeaderSection = styled.div`
    ${tw`mb-6 p-6 rounded-xl border`};
    background-color: #111827;
    border-color: #1f2937;
`;

const FilterWrapper = styled.div`
    ${tw`flex items-center gap-3 px-4 py-2 rounded-lg border`};
    background-color: #111827;
    border-color: #374151;
`;

const EmptyStateWrapper = styled.div`
    ${tw`flex flex-col items-center justify-center py-20 px-4 rounded-xl border`};
    background-color: #111827;
    border-color: #1f2937;
`;

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
            <HeaderSection>
                {/* Search and Filter Controls */}
                <div css={tw`flex flex-wrap gap-3`}>
                    {rootAdmin && (
                        <FilterWrapper>
                            <p
                                css={tw`text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2`}
                            >
                                <FontAwesomeIcon icon={showOnlyAdmin ? faGlobe : faUser} />
                                {showOnlyAdmin ? 'All Servers' : 'My Servers'}
                            </p>
                            <Switch
                                name={'show_all_servers'}
                                defaultChecked={showOnlyAdmin}
                                onChange={() => setShowOnlyAdmin((s) => !s)}
                            />
                        </FilterWrapper>
                    )}
                </div>
            </HeaderSection>
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
                            <EmptyStateWrapper>
                                <div css={tw`text-5xl mb-4 opacity-30`}>
                                    <FontAwesomeIcon icon={faBoxOpen} />
                                </div>
                                <p css={tw`text-xl font-bold mb-2 text-neutral-200`}>No Servers Found</p>
                                <p css={tw`text-sm text-center text-neutral-500 max-w-[400px]`}>
                                    {showOnlyAdmin
                                        ? 'No other servers are available to display.'
                                        : query
                                        ? `No servers match your search "${query}"`
                                        : "You don't have any servers yet."}
                                </p>
                            </EmptyStateWrapper>
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
