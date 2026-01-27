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
    ${tw`hidden md:block w-60 bg-neutral-900 border-r border-neutral-800 flex-shrink-0`};
`;

const SidebarInner = styled.div`
    ${tw`sticky top-0 h-screen flex flex-col`};
`;

const NavItem = styled(NavLink)`
    ${tw`flex items-center gap-3 px-4 py-3 text-sm text-neutral-400 no-underline transition-colors duration-150`};
    ${tw`hover:text-neutral-100 hover:bg-neutral-800`};

    &.active {
        ${tw`text-neutral-100 bg-neutral-800`};
    }
`;

const ExternalLink = styled.a`
    ${tw`flex items-center gap-3 px-4 py-3 text-sm text-neutral-400 no-underline transition-colors duration-150`};
    ${tw`hover:text-neutral-100 hover:bg-neutral-800`};
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
                <div css={tw`px-4 py-3 border-b border-neutral-800`}>
                    <p css={tw`text-xs uppercase tracking-wider text-neutral-500`}>Server</p>
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
