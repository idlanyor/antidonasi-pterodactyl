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
    ${tw`w-60 flex-shrink-0`};
    background-color: var(--sidebar-bg);
    border-right: 1px solid var(--sidebar-border);
    transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const SidebarInner = styled.div`
    ${tw`sticky top-0 h-screen flex flex-col`};
`;

const NavItem = styled(NavLink)`
    ${tw`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors duration-150`};
    color: var(--sidebar-text);

    &:hover {
        color: var(--sidebar-text-hover);
        background-color: var(--sidebar-hover-bg);
    }

    &.active {
        color: var(--sidebar-text-active);
        background-color: var(--sidebar-active-bg);
    }
`;

const SidebarButton = styled.button`
    ${tw`flex items-center gap-3 px-4 py-3 text-sm w-full text-left transition-colors duration-150`};
    color: var(--sidebar-text);

    &:hover {
        color: var(--sidebar-text-hover);
        background-color: var(--sidebar-hover-bg);
    }
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
                <div css={tw`px-4 py-3.5`} style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
                    <Link
                        to={'/'}
                        className={'text-base font-semibold no-underline'}
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {name}
                    </Link>
                </div>
                <nav css={tw`flex-1 py-2.5`}>
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
                            css={tw`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors duration-150`}
                            style={{
                                color: 'var(--sidebar-text)',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = 'var(--sidebar-text-hover)';
                                e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = 'var(--sidebar-text)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <FontAwesomeIcon icon={faCogs} />
                            Admin
                        </a>
                    )}
                </nav>
                <div style={{ borderTop: '1px solid var(--sidebar-border)', padding: '0.5rem 0' }}>
                    <SidebarButton onClick={onTriggerLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Sign Out
                    </SidebarButton>
                </div>
            </SidebarInner>
        </SidebarWrapper>
    );
};
