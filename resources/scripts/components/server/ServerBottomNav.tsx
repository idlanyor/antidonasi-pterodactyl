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
} from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import Can from '@/components/elements/Can';
import routes from '@/routers/routes';

const BottomNav = styled.nav`
    ${tw`fixed bottom-4 left-4 right-4 z-40 md:hidden`};
`;

const BottomNavInner = styled.div`
    ${tw`bg-neutral-900 border border-neutral-800 rounded-2xl px-2 py-2 flex items-center gap-2 overflow-x-auto`};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
`;

const BottomItem = styled(NavLink)`
    ${tw`flex flex-col items-center justify-center text-[10px] text-neutral-400 no-underline px-2 py-1 rounded-lg min-w-[64px]`};
    ${tw`transition-colors duration-150`};

    &.active {
        ${tw`text-neutral-100 bg-neutral-800`};
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

    const to = (value: string, url = false) => {
        if (value === '/') {
            return url ? match.url : match.path;
        }
        return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
    };

    const items = routes.server.filter((route) => !!route.name);

    return (
        <BottomNav>
            <BottomNavInner>
                {items.map((route) => {
                    const icon = iconMap[route.path] || faTerminal;
                    return route.permission ? (
                        <Can key={route.path} action={route.permission} matchAny>
                            <BottomItem to={to(route.path, true)} exact={route.exact}>
                                <FontAwesomeIcon icon={icon} />
                                <span css={tw`mt-1`}>{route.name}</span>
                            </BottomItem>
                        </Can>
                    ) : (
                        <BottomItem key={route.path} to={to(route.path, true)} exact={route.exact}>
                            <FontAwesomeIcon icon={icon} />
                            <span css={tw`mt-1`}>{route.name}</span>
                        </BottomItem>
                    );
                })}
            </BottomNavInner>
        </BottomNav>
    );
};
