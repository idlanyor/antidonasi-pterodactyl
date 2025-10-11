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
    background: linear-gradient(135deg, rgba(7, 16, 36, 1) 0%, rgba(9, 35, 24, 1) 100%);
    overflow: hidden;

    &::before,
    &::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        filter: blur(70px);
        opacity: 0.4;
        pointer-events: none;
    }

    /* Blue glow top-left */
    &::before {
        width: 620px;
        height: 620px;
        top: -180px;
        left: -180px;
        background: radial-gradient(closest-side, rgba(59, 130, 246, 0.55), rgba(59, 130, 246, 0));
    }

    /* Green glow bottom-right */
    &::after {
        width: 560px;
        height: 560px;
        right: -160px;
        bottom: -160px;
        background: radial-gradient(closest-side, rgba(16, 185, 129, 0.45), rgba(16, 185, 129, 0));
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
