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
    background: radial-gradient(1200px 600px at 10% -10%, rgba(59, 130, 246, 0.25), transparent),
        radial-gradient(900px 500px at 110% 110%, rgba(16, 185, 129, 0.18), transparent),
        linear-gradient(135deg, rgba(5, 12, 24, 1) 0%, rgba(6, 21, 15, 1) 100%);
    overflow: hidden;
`;

const CenterWrap = styled.div`
    ${tw`min-h-screen w-full flex items-center justify-center`};
    position: relative;
    z-index: 1;
`;

const ColorOrbs = styled.div`
    ${tw`absolute inset-0 pointer-events-none`};
    z-index: 0;
    background: radial-gradient(220px 220px at 12% 22%, rgba(59, 130, 246, 0.18), transparent 65%),
        radial-gradient(160px 160px at 80% 18%, rgba(236, 72, 153, 0.16), transparent 65%),
        radial-gradient(200px 200px at 24% 80%, rgba(16, 185, 129, 0.16), transparent 65%),
        radial-gradient(140px 140px at 88% 78%, rgba(245, 158, 11, 0.14), transparent 65%),
        radial-gradient(180px 180px at 50% 10%, rgba(99, 102, 241, 0.12), transparent 65%);
    filter: blur(30px);
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
