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
    ${tw`relative mb-12 p-10 md:p-16 rounded-3xl overflow-hidden`};
    background: linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%);
    border: 1px solid rgba(124, 58, 237, 0.1);
    box-shadow: 0 10px 30px 0 rgba(15, 23, 42, 0.05);

    h1 {
        ${tw`text-4xl md:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-tight max-w-2xl`};
        font-family: 'Satoshi', sans-serif;
    }

    p {
        ${tw`text-brand-slate mt-4 text-lg md:text-xl font-bold leading-relaxed max-w-xl`};
    }

    &::after {
        content: '';
        ${tw`absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none hidden md:block`};
        background: radial-gradient(circle at 100% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 70%);
    }
`;

const HeaderSection = styled.div`
    ${tw`mb-12 p-10 rounded-3xl border shadow-lg`};
    background: #ffffff;
    border-color: #e2e8f0;
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);
`;

const FilterWrapper = styled.div`
    ${tw`flex items-center gap-4 px-6 py-3 rounded-2xl border`};
    background: #f1f5f9;
    border-color: #e2e8f0;
`;

const EmptyStateWrapper = styled.div`
    ${tw`flex flex-col items-center justify-center py-32 px-6 rounded-3xl border`};
    background: #ffffff;
    border-color: #e2e8f0;
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);
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
                <div css={tw`flex flex-wrap items-center justify-between gap-6`}>
                    <div css={tw`flex-1 max-w-md`}>
                        <div css={tw`relative`}>
                            <div css={tw`absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-slate`}>
                                <FontAwesomeIcon icon={faBoxOpen} />
                            </div>
                            <input
                                type={'text'}
                                placeholder={'Search servers...'}
                                css={tw`w-full bg-neutral-100 border border-neutral-200 rounded-2xl py-4 pl-12 pr-4 text-brand-navy font-bold focus:bg-white focus:border-accent-purple transition-all outline-none`}
                            />
                        </div>
                    </div>
                    {rootAdmin && (
                        <FilterWrapper>
                            <p
                                css={tw`text-sm font-black uppercase tracking-widest text-brand-slate flex items-center gap-3`}
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
                            <div css={tw`flex flex-col gap-4`}>
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
                                <div css={tw`text-7xl mb-6 text-neutral-200`}>
                                    <FontAwesomeIcon icon={faBoxOpen} />
                                </div>
                                <h2 css={tw`text-2xl font-black mb-3 text-brand-navy`}>No Servers Found</h2>
                                <p css={tw`text-brand-slate text-center max-w-[400px] font-bold`}>
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
