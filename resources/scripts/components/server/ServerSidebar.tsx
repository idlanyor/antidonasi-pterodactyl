import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTerminal,
    faFolderOpen,
    faDatabase,
    faCalendarAlt,
    faUsers,
    faHdd,
    faNetworkWired,
    faSlidersH,
    faCogs,
    faListAlt,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import routes from '@/routers/routes';

const SidebarWrapper = styled.aside`
    ${tw`hidden md:block w-64 flex-shrink-0 z-40`};
    background-color: #ffffff;
    border-right: 1px solid #e2e8e0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const SidebarInner = styled.div`
    ${tw`sticky top-16 h-[calc(100vh-4rem)] flex flex-col`};
`;

const NavItem = styled(NavLink)`
    ${tw`flex items-center gap-4 px-6 py-4 text-sm font-bold text-brand-slate no-underline transition-all duration-300 relative`};

    &:hover {
        ${tw`text-brand-navy bg-neutral-50`};
        background-color: #f8fafc;
    }

    &.active {
        ${tw`text-accent-purple`};
        background-color: rgba(124, 58, 237, 0.05);
        &::after {
            content: '';
            ${tw`absolute right-0 top-0 h-full w-[3px] bg-accent-purple`};
        }
    }

    & svg {
        ${tw`w-4 h-4 transition-transform duration-200`};
    }
`;

const ExternalLink = styled.a`
    ${tw`flex items-center gap-4 px-6 py-4 text-sm font-bold text-brand-slate no-underline transition-all duration-300`};

    &:hover {
        ${tw`text-brand-navy bg-neutral-50`};
        background-color: #f8fafc;
    }
`;

const iconMap: Record<string, any> = {
    '/': faTerminal,
    '/files': faFolderOpen,
    '/databases': faDatabase,
    '/schedules': faCalendarAlt,
    '/users': faUsers,
    '/backups': faHdd,
    '/network': faNetworkWired,
    '/startup': faSlidersH,
    '/settings': faCogs,
    '/activity': faListAlt,
};

export default () => {
    const match = useRouteMatch<{ id: string }>();
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);

    const to = (value: string, url = false) => {
        if (value === '/') {
            return url ? match.url : match.path;
        }
        return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
    };

    const items = routes.server.filter((route) => !!route.name);

    return (
        <SidebarWrapper>
            <SidebarInner>
                <div css={tw`px-6 py-6`}>
                    <p css={tw`text-[11px] uppercase font-black tracking-[0.2em] text-brand-navy`}>Management</p>
                </div>
                <nav css={tw`flex-1 py-3 flex flex-col`}>
                    {items.map((route) => {
                        const icon = iconMap[route.path] || faTerminal;
                        return route.permission ? (
                            <Can key={route.path} action={route.permission} matchAny>
                                <NavItem to={to(route.path, true)} exact={route.exact}>
                                    <FontAwesomeIcon icon={icon} />
                                    {route.name}
                                </NavItem>
                            </Can>
                        ) : (
                            <NavItem key={route.path} to={to(route.path, true)} exact={route.exact}>
                                <FontAwesomeIcon icon={icon} />
                                {route.name}
                            </NavItem>
                        );
                    })}
                    {rootAdmin && serverId && (
                        <ExternalLink href={`/admin/servers/view/${serverId}`} target={'_blank'}>
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                            Admin View
                        </ExternalLink>
                    )}
                </nav>
            </SidebarInner>
        </SidebarWrapper>
    );
};
