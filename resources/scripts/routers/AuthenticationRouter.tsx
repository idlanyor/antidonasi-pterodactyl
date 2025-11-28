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
    ${tw`min-h-screen w-full relative`};
    background: linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%);
    overflow: hidden;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 20% 80%, rgba(245, 133, 41, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(221, 42, 123, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(129, 52, 175, 0.3) 0%, transparent 50%);
        opacity: 0.6;
    }

    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.1;
    }
`;

const CenterWrap = styled.div`
    ${tw`min-h-screen w-full flex items-center justify-center`};
    position: relative;
    z-index: 1;
    padding: 1rem 0.5rem;
`;

const ColorOrbs = styled.div`
    ${tw`absolute inset-0 pointer-events-none`};
    z-index: 0;
`;

export default () => {
    const history = useHistory();
    const location = useLocation();
    const { path } = useRouteMatch();

    return (
        <AuthBackground>
            <ColorOrbs />
            <CenterWrap>
                <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 700 }}>
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
