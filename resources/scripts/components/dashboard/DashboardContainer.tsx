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
    ${tw`mb-10 p-8 rounded-2xl border`};
    background: rgba(17, 24, 39, 0.7);
    backdrop-filter: blur(16px);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const TitleWrapper = styled.div`
    ${tw`mb-8`};

    h1 {
        ${tw`text-3xl font-bold text-white tracking-tight`};
    }

    p {
        ${tw`text-neutral-400 mt-2 text-sm`};
    }
`;

const FilterWrapper = styled.div`
    ${tw`flex items-center gap-4 px-4 py-2 rounded-xl border`};
    background: rgba(10, 10, 20, 0.5);
    border-color: rgba(255, 255, 255, 0.05);
`;

const EmptyStateWrapper = styled.div`
    ${tw`flex flex-col items-center justify-center py-24 px-4 rounded-2xl border`};
    background: rgba(17, 24, 39, 0.4);
    backdrop-filter: blur(8px);
    border-color: rgba(255, 255, 255, 0.05);
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
            <TitleWrapper>
                <h1>Server Overview</h1>
                <p>Welcome back! You can manage all your instances here.</p>
            </TitleWrapper>

            {/* Header Section */}
            <HeaderSection>
                {/* Search and Filter Controls */}
                <div css={tw`flex flex-wrap items-center justify-between gap-4`}>
                    <div css={tw`flex-1 max-w-md`}>{/* You can add a search input here later if needed */}</div>
                    {rootAdmin && (
                        <FilterWrapper>
                            <p
                                css={tw`text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-3`}
                            >
                                <FontAwesomeIcon icon={showOnlyAdmin ? faGlobe : faUser} css={tw`text-indigo-400`} />
                                {showOnlyAdmin ? 'Viewing All Servers' : 'Viewing My Servers'}
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
                            <div css={tw`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
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
