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

const TitleWrapper = styled.div`
    ${tw`relative mb-6 p-6 md:p-8 rounded-2xl overflow-hidden`};
    background: var(--gradient-hero);
    border: 1px solid var(--gradient-hero-border);
    box-shadow: var(--shadow-lg);
    transition: background 0.3s ease, border-color 0.3s ease;

    h1 {
        ${tw`text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight max-w-2xl`};
        color: var(--text-primary);
        font-family: 'Raleway', sans-serif;
    }

    p {
        ${tw`mt-2 text-sm md:text-base font-bold leading-relaxed max-w-xl`};
        color: var(--text-secondary);
    }

    &::after {
        content: '';
        ${tw`absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none hidden md:block`};
        background: var(--gradient-hero-radial);
    }
`;

const HeaderSection = styled.div`
    ${tw`mb-6 p-6 rounded-2xl border`};
    background: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);
    transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const FilterWrapper = styled.div`
    ${tw`flex items-center gap-3 px-4 py-2 rounded-xl border`};
    background: var(--filter-bg);
    border-color: var(--filter-border);
    transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const EmptyStateWrapper = styled.div`
    ${tw`flex flex-col items-center justify-center py-20 px-6 rounded-2xl border`};
    background: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);
    transition: background-color 0.3s ease, border-color 0.3s ease;
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
                    <div css={tw`flex-1 max-w-md`}>
                        <div css={tw`relative`}>
                            <div
                                css={tw`absolute left-3.5 top-1/2 transform -translate-y-1/2`}
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <FontAwesomeIcon icon={faBoxOpen} />
                            </div>
                            <input
                                type={'text'}
                                placeholder={'Search servers...'}
                                css={tw`w-full rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold transition-all outline-none`}
                                style={{
                                    backgroundColor: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-primary)',
                                    color: 'var(--text-primary)',
                                }}
                            />
                        </div>
                    </div>
                    {rootAdmin && (
                        <FilterWrapper>
                            <p
                                css={tw`text-sm font-black uppercase tracking-widest flex items-center gap-3`}
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <FontAwesomeIcon icon={showOnlyAdmin ? faGlobe : faUser} css={tw`text-accent-purple`} />
                                {showOnlyAdmin ? 'Global View' : 'Personal View'}
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
                                            animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${
                                                index * 0.05
                                            }s both`,
                                        }}
                                    >
                                        <ServerRow server={server} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyStateWrapper>
                                <div css={tw`text-5xl mb-4`} style={{ color: 'var(--text-muted)' }}>
                                    <FontAwesomeIcon icon={faBoxOpen} />
                                </div>
                                <h2 css={tw`text-xl font-black mb-2`} style={{ color: 'var(--text-primary)' }}>
                                    No Servers Found
                                </h2>
                                <p
                                    css={tw`text-center max-w-[400px] font-bold`}
                                    style={{ color: 'var(--text-secondary)' }}
                                >
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
