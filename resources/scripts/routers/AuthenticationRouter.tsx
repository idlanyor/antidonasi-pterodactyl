import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import LoginContainer from '@/components/auth/LoginContainer';
import ForgotPasswordContainer from '@/components/auth/ForgotPasswordContainer';
import ResetPasswordContainer from '@/components/auth/ResetPasswordContainer';
import LoginCheckpointContainer from '@/components/auth/LoginCheckpointContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const AuthBackground = styled.div`
    ${tw`min-h-screen w-full relative flex items-center justify-center`};
    background-color: #0b0f1a;
    background-image: radial-gradient(circle at 0% 0%, rgba(79, 70, 229, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 100% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 100% 100%, rgba(219, 39, 119, 0.1) 0%, transparent 40%),
        radial-gradient(circle at 0% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 1) 0%, rgba(11, 15, 26, 1) 100%);
    overflow: hidden;

    &::before {
        content: '';
        ${tw`absolute inset-0`};
        background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3e%3Cfilter id='noiseFilter'%3e%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3e%3C/filter%3e%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3e%3C/svg%3e");
        opacity: 0.03;
        pointer-events: none;
    }
`;

const CenterWrap = styled.div`
    ${tw`w-full flex items-center justify-center z-10`};
    padding: 1.5rem;
`;

export default () => {
    const history = useHistory();
    const location = useLocation();
    const { path } = useRouteMatch();

    return (
        <AuthBackground>
            <CenterWrap>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <Switch location={location}>
                        <Route path={`${path}/login`} component={LoginContainer} exact />
                        <Route path={`${path}/login/checkpoint`} component={LoginCheckpointContainer} />
                        <Route path={`${path}/password`} component={ForgotPasswordContainer} exact />
                        <Route path={`${path}/password/reset/:token`} component={ResetPasswordContainer} />
                        <Route path={`${path}/checkpoint`} />
                        <Route path={'*'}>
                            <NotFound onBack={() => history.push('/auth/login')} />
                        </Route>
                    </Switch>
                </div>
            </CenterWrap>
        </AuthBackground>
    );
};
