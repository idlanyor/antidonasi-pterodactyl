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

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline px-4 cursor-pointer transition-all duration-300 relative`};
        ${tw`text-brand-slate font-bold text-sm`};

        &:hover:not(:disabled) {
            ${tw`text-accent-purple bg-neutral-50`};
            background-color: #f8fafc;
        }

        &.active {
            ${tw`text-accent-purple`};
            &::after {
                content: '';
                ${tw`absolute bottom-0 left-0 w-full h-[2px] bg-accent-purple`};
            }
        }
    }
`;
const NavWrapper = styled.div`
    ${tw`w-full sticky top-0 z-50`};
    background-color: #ffffff;
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);
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
                        className={'text-xl font-black no-underline transition-colors duration-150 text-brand-navy'}
                        style={{
                            fontFamily: "'Satoshi', sans-serif",
                            letterSpacing: '-0.03em',
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
