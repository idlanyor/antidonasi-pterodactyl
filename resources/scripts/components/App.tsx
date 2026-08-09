import React, { lazy } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Router, Switch } from 'react-router-dom';
import { StoreProvider } from 'easy-peasy';
import { store } from '@/state';
import { SiteSettings } from '@/state/settings';
import ProgressBar from '@/components/elements/ProgressBar';
import { NotFound } from '@/components/elements/ScreenBlock';
import tw from 'twin.macro';
import GlobalStylesheet from '@/assets/css/GlobalStylesheet';
import { history } from '@/components/history';
import { setupInterceptors } from '@/api/interceptors';
import AuthenticatedRoute from '@/components/elements/AuthenticatedRoute';
import { ServerContext } from '@/state/server';
import { ThemeProvider } from '@/theme';
import FloatingAccentPicker from '@/components/elements/FloatingAccentPicker';
import '@/assets/tailwind.css';
import Spinner from '@/components/elements/Spinner';

const DashboardRouter = lazy(() => import(/* webpackChunkName: "dashboard" */ '@/routers/DashboardRouter'));
const ServerRouter = lazy(() => import(/* webpackChunkName: "server" */ '@/routers/ServerRouter'));
const AuthenticationRouter = lazy(() => import(/* webpackChunkName: "auth" */ '@/routers/AuthenticationRouter'));
const PricingPage = lazy(() => import(/* webpackChunkName: "pricing" */ '@/components/PricingPage'));
const LandingPage = lazy(() => import(/* webpackChunkName: "landing" */ '@/components/LandingPage'));
const StoreCheckout = lazy(() => import(/* webpackChunkName: "store-checkout" */ '@/components/store/StoreCheckoutContainer'));
const StoreCheckoutSuccess = lazy(() => import(/* webpackChunkName: "store-checkout" */ '@/components/store/StoreCheckoutSuccessContainer'));

interface ExtendedWindow extends Window {
    SiteConfiguration?: SiteSettings;
    PterodactylUser?: {
        uuid: string;
        username: string;
        email: string;
        /* eslint-disable camelcase */
        root_admin: boolean;
        use_totp: boolean;
        language: string;
        updated_at: string;
        created_at: string;
        /* eslint-enable camelcase */
    };
}

setupInterceptors(history);

const App = () => {
    const { PterodactylUser, SiteConfiguration } = window as ExtendedWindow;
    if (PterodactylUser && !store.getState().user.data) {
        store.getActions().user.setUserData({
            uuid: PterodactylUser.uuid,
            username: PterodactylUser.username,
            email: PterodactylUser.email,
            language: PterodactylUser.language,
            rootAdmin: PterodactylUser.root_admin,
            useTotp: PterodactylUser.use_totp,
            createdAt: new Date(PterodactylUser.created_at),
            updatedAt: new Date(PterodactylUser.updated_at),
        });
    }

    if (!store.getState().settings.data) {
        store.getActions().settings.setSettings(SiteConfiguration!);
    }

    return (
        <ThemeProvider>
            <GlobalStylesheet />
            <StoreProvider store={store}>
                <ProgressBar />
                <FloatingAccentPicker />
                <div css={tw`mx-auto w-auto`}>
                    <Router history={history}>
                        <Switch>
                            <Route path={'/'} exact>
                                <Spinner.Suspense>
                                    {PterodactylUser ? <DashboardRouter /> : <LandingPage />}
                                </Spinner.Suspense>
                            </Route>
                            <Route path={'/auth'}>
                                <Spinner.Suspense>
                                    <AuthenticationRouter />
                                </Spinner.Suspense>
                            </Route>
                            <Route path={'/pricing'}>
                                <Spinner.Suspense>
                                    <PricingPage />
                                </Spinner.Suspense>
                            </Route>
                            <Route path={'/checkout/success/:id'}>
                                <Spinner.Suspense>
                                    <StoreCheckoutSuccess />
                                </Spinner.Suspense>
                            </Route>
                            <Route path={'/checkout/:id'}>
                                <Spinner.Suspense>
                                    <StoreCheckout />
                                </Spinner.Suspense>
                            </Route>
                            <AuthenticatedRoute path={'/server/:id'}>
                                <Spinner.Suspense>
                                    <ServerContext.Provider>
                                        <ServerRouter />
                                    </ServerContext.Provider>
                                </Spinner.Suspense>
                            </AuthenticatedRoute>
                            <AuthenticatedRoute path={'/dashboard'}>
                                <Spinner.Suspense>
                                    <DashboardRouter />
                                </Spinner.Suspense>
                            </AuthenticatedRoute>
                            {/* Fallback route to catch legacy / links that should go to dashboard if authenticated */}
                            <AuthenticatedRoute path={'/'}>
                                <Spinner.Suspense>
                                    <DashboardRouter />
                                </Spinner.Suspense>
                            </AuthenticatedRoute>
                            <Route path={'*'}>
                                <NotFound />
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </StoreProvider>
        </ThemeProvider>
    );
};

export default hot(App);
