import * as React from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
    ${tw`grid grid-cols-1 lg:grid-cols-3 gap-8`};
`;

const HeaderContainer = styled.div`
    ${tw`mb-6`};

    h1 {
        ${tw`text-2xl md:text-3xl font-black tracking-tight`};
        font-family: 'Raleway', sans-serif;
        color: var(--text-primary);
    }

    p {
        ${tw`mt-1 text-sm md:text-base font-bold leading-relaxed`};
        color: var(--text-secondary);
    }
`;

export default () => {
    const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();

    return (
        <PageContentBlock title={'Account Overview'}>
            <HeaderContainer>
                <h1>Account Settings</h1>
                <p>Manage your account password, email address, and two-factor authentication.</p>
            </HeaderContainer>

            {state?.twoFactorRedirect && (
                <MessageBox title={'2-Factor Required'} type={'error'} css={tw`mb-8`}>
                    Your account must have two-factor authentication enabled in order to continue.
                </MessageBox>
            )}

            <Container>
                <ContentBox title={'Update Password'} showFlashes={'account:password'}>
                    <UpdatePasswordForm />
                </ContentBox>
                <ContentBox title={'Update Email Address'} showFlashes={'account:email'}>
                    <UpdateEmailAddressForm />
                </ContentBox>
                <ContentBox title={'Two-Step Verification'}>
                    <ConfigureTwoFactorForm />
                </ContentBox>
            </Container>
        </PageContentBlock>
    );
};
