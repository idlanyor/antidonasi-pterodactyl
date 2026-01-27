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
    ${tw`min-h-screen w-full relative bg-neutral-900`};
    background-color: #0f172a;
    overflow: hidden;
`;

const CenterWrap = styled.div`
    ${tw`min-h-screen w-full flex items-center justify-center`};
    position: relative;
    z-index: 1;
    padding: 1.5rem 0.75rem;
`;

export default () => {
    const history = useHistory();
    const location = useLocation();
    const { path } = useRouteMatch();

    return (
        <AuthBackground>
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
