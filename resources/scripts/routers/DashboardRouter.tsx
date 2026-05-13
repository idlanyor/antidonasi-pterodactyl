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
    background-color: #f8fafc;
    overflow-x: hidden;

    &::before {
        content: '';
        ${tw`absolute inset-0`};
        background: linear-gradient(135deg, rgba(236, 72, 153, 0.03) 0%, rgba(124, 58, 237, 0.03) 100%);
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
                        <Route path={['/', '/dashboard']} exact>
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
