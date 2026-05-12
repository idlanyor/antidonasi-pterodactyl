import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import ServerSidebar from '@/components/server/ServerSidebar';
import ServerBottomNav from '@/components/server/ServerBottomNav';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import { CSSTransition } from 'react-transition-group';
import Spinner from '@/components/elements/Spinner';
import { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import InstallListener from '@/components/server/InstallListener';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { useLocation } from 'react-router';
import ConflictStateRenderer from '@/components/server/ConflictStateRenderer';
import PermissionRoute from '@/components/elements/PermissionRoute';
import routes from '@/routers/routes';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const ServerBackground = styled.div`
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
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();

    const [error, setError] = useState('');

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const inConflictState = ServerContext.useStoreState((state) => state.server.inConflictState);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);

    const to = (value: string, url = false) => {
        if (value === '/') {
            return url ? match.url : match.path;
        }
        return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
    };

    useEffect(
        () => () => {
            clearServerState();
        },
        []
    );

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    return (
        <ServerBackground key={'server-router'}>
            <NavigationBar />
            <div className={'flex flex-col md:flex-row min-h-[calc(100vh-3rem)] z-10 relative'}>
                <ServerSidebar />
                <div className={'flex-1 min-w-0 pb-24 md:pb-0'}>
                    {!uuid || !id ? (
                        error ? (
                            <ServerError message={error} />
                        ) : (
                            <Spinner size={'large'} centered />
                        )
                    ) : (
                        <>
                            <CSSTransition timeout={150} classNames={'fade'} appear in>
                                <div />
                            </CSSTransition>
                            <InstallListener />
                            <TransferListener />
                            <WebsocketHandler />
                            {inConflictState && !location.pathname.endsWith(`/server/${id}`) ? (
                                <ConflictStateRenderer />
                            ) : (
                                <ErrorBoundary>
                                    <TransitionRouter>
                                        <Switch location={location}>
                                            {routes.server.map(({ path, permission, component: Component }) => (
                                                <PermissionRoute
                                                    key={path}
                                                    permission={permission}
                                                    path={to(path)}
                                                    exact
                                                >
                                                    <Spinner.Suspense>
                                                        <Component />
                                                    </Spinner.Suspense>
                                                </PermissionRoute>
                                            ))}
                                            <Route path={'*'} component={NotFound} />
                                        </Switch>
                                    </TransitionRouter>
                                </ErrorBoundary>
                            )}
                        </>
                    )}
                </div>
            </div>
            <ServerBottomNav />
        </ServerBackground>
    );
};
