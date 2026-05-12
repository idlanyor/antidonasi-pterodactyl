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
    background-color: #0b0f1a;
    background-image: radial-gradient(circle at 0% 0%, rgba(79, 70, 229, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 100% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 1) 0%, rgba(11, 15, 26, 1) 100%);
    overflow: hidden;

    &::before {
        content: '';
        ${tw`absolute inset-0`};
        background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3e%3Cfilter id='noiseFilter'%3e%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3e%3C/filter%3e%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3e%3C/svg%3e");
        opacity: 0.02;
        pointer-events: none;
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
