import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';
import ThemeToggle from '@/components/elements/ThemeToggle';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline px-4 cursor-pointer transition-all duration-300 relative`};
        color: var(--nav-text);
        font-weight: 700;
        font-size: 0.875rem;

        &:hover:not(:disabled) {
            color: var(--nav-text-hover);
            background-color: var(--nav-hover-bg);
        }

        &.active {
            color: var(--nav-text-hover);
            &::after {
                content: '';
                ${tw`absolute bottom-0 left-0 w-full h-[2px]`};
                background-color: var(--nav-text-hover);
            }
        }
    }
`;
const NavWrapper = styled.div`
    ${tw`w-full sticky top-0 z-50`};
    background-color: var(--nav-bg);
    box-shadow: var(--nav-shadow);
    border-bottom: 1px solid var(--border-primary);
    transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
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
        <NavWrapper>
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-16 max-w-[1280px] px-6'}>
                <div id={'logo'} className={'flex-1'}>
                    <Link
                        to={'/dashboard'}
                        className={'text-xl font-black no-underline transition-colors duration-150'}
                        style={{
                            fontFamily: "'Satoshi', sans-serif",
                            letterSpacing: '-0.03em',
                            color: 'var(--text-primary)',
                        }}
                    >
                        {name}
                    </Link>
                </div>
                <RightNavigation className={'flex h-full items-center justify-center'}>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink
                            to={'/dashboard'}
                            isActive={(match, location) =>
                                location.pathname === '/' || location.pathname === '/dashboard'
                            }
                        >
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'}>
                            <span className={'flex items-center w-6 h-6'}>
                                <Avatar.User />
                            </span>
                        </NavLink>
                    </Tooltip>
                    <div className={'navigation-link flex items-center px-2'}>
                        <ThemeToggle />
                    </div>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </div>
        </NavWrapper>
    );
};
