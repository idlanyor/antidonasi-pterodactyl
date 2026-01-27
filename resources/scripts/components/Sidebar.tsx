import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';

const SidebarWrapper = styled.aside`
    ${tw`w-60 bg-neutral-900 border-r border-neutral-800 flex-shrink-0`};
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

const SidebarButton = styled.button`
    ${tw`flex items-center gap-3 px-4 py-3 text-sm text-neutral-400 w-full text-left transition-colors duration-150`};
    ${tw`hover:text-neutral-100 hover:bg-neutral-800`};
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <SidebarWrapper>
            <SpinnerOverlay visible={isLoggingOut} />
            <SidebarInner>
                <div css={tw`px-4 py-5 border-b border-neutral-800`}>
                    <Link to={'/'} className={'text-lg font-semibold text-neutral-100 no-underline'}>
                        {name}
                    </Link>
                </div>
                <nav css={tw`flex-1 py-3`}>
                    <NavItem exact to={'/'}>
                        <FontAwesomeIcon icon={faLayerGroup} />
                        Dashboard
                    </NavItem>
                    <NavItem to={'/account'}>
                        <FontAwesomeIcon icon={faUser} />
                        Account
                    </NavItem>
                    {rootAdmin && (
                        <a
                            href={'/admin'}
                            rel={'noreferrer'}
                            css={tw`flex items-center gap-3 px-4 py-3 text-sm text-neutral-400 no-underline transition-colors duration-150 hover:text-neutral-100 hover:bg-neutral-800`}
                        >
                            <FontAwesomeIcon icon={faCogs} />
                            Admin
                        </a>
                    )}
                </nav>
                <div css={tw`border-t border-neutral-800 py-2`}>
                    <SidebarButton onClick={onTriggerLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Sign Out
                    </SidebarButton>
                </div>
            </SidebarInner>
        </SidebarWrapper>
    );
};
