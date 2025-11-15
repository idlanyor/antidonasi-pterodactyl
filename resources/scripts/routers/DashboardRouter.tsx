import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import SubNavigation from '@/components/elements/SubNavigation';
import { useLocation } from 'react-router';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const DashboardBackground = styled.div`
    ${tw`min-h-screen w-full relative`};
    background: linear-gradient(135deg, rgba(15, 10, 10, 1) 0%, rgba(20, 10, 15, 1) 50%, rgba(15, 10, 10, 1) 100%);
    overflow: hidden;

    &::before,
    &::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.5;
        pointer-events: none;
        animation: pulse 8s ease-in-out infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.7;
        }
    }

    /* Yellow glow top-left */
    &::before {
        width: 700px;
        height: 700px;
        top: -200px;
        left: -200px;
        background: radial-gradient(closest-side, rgba(255, 215, 0, 0.4), rgba(255, 215, 0, 0));
    }

    /* Red glow bottom-right */
    &::after {
        width: 600px;
        height: 600px;
        right: -180px;
        bottom: -180px;
        background: radial-gradient(closest-side, rgba(255, 51, 51, 0.35), rgba(255, 51, 51, 0));
        animation-delay: 1s;
    }
`;

export default () => {
    const location = useLocation();

    return (
        <DashboardBackground>
            <NavigationBar />
            {location.pathname.startsWith('/account') && (
                <SubNavigation>
                    <div>
                        {routes.account
                            .filter((route) => !!route.name)
                            .map(({ path, name, exact = false }) => (
                                <NavLink key={path} to={`/account/${path}`.replace('//', '/')} exact={exact}>
                                    {name}
                                </NavLink>
                            ))}
                    </div>
                </SubNavigation>
            )}
            <TransitionRouter>
                <React.Suspense fallback={<Spinner centered />}>
                    <Switch location={location}>
                        <Route path={'/'} exact>
                            <DashboardContainer />
                        </Route>
                        {routes.account.map(({ path, component: Component }) => (
                            <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
                                <Component />
                            </Route>
                        ))}
                        <Route path={'*'}>
                            <NotFound />
                        </Route>
                    </Switch>
                </React.Suspense>
            </TransitionRouter>
        </DashboardBackground>
    );
};
