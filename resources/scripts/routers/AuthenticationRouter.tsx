import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import LoginContainer from '@/components/auth/LoginContainer';
import ForgotPasswordContainer from '@/components/auth/ForgotPasswordContainer';
import ResetPasswordContainer from '@/components/auth/ResetPasswordContainer';
import LoginCheckpointContainer from '@/components/auth/LoginCheckpointContainer';
import RegisterContainer from '@/components/auth/RegisterContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const AuthBackground = styled.div`
    ${tw`min-h-screen w-full relative flex items-center justify-center`};
    background-color: var(--bg-primary);
    overflow: hidden;
    transition: background-color 0.3s ease;

    &::before {
        content: '';
        ${tw`absolute inset-0`};
        background: var(--gradient-hero);
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
                        <Route path={`${path}/register`} component={RegisterContainer} exact />
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
