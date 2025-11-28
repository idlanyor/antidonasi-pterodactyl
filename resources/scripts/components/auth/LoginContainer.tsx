import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import AuthField from '@/components/auth/AuthField';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';

interface Values {
    username: string;
    password: string;
}

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('A username or email must be provided.'),
                password: string().required('Please enter your account password.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer title={'Login to Continue'} css={tw`w-full flex`}>
                    <div css={tw`mb-6 text-center`}>
                        <h1
                            css={tw`text-2xl font-bold mb-1`}
                            style={{
                                color: '#1a202c',
                                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                letterSpacing: '-0.02em',
                                fontWeight: 700,
                            }}
                        >
                            Welcome Back
                        </h1>
                        <p
                            css={tw`text-sm`}
                            style={{
                                color: '#718096',
                                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                fontWeight: 400,
                            }}
                        >
                            Sign in to access your control panel
                        </p>
                    </div>

                    <div css={tw`space-y-4`}>
                        <AuthField
                            name={'username'}
                            label={'Username or Email'}
                            type={'text'}
                            placeholder={'Enter your username or email'}
                            disabled={isSubmitting}
                        />
                        <AuthField
                            name={'password'}
                            label={'Password'}
                            type={'password'}
                            placeholder={'Enter your password'}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div css={tw`mt-6`}>
                        <Button
                            type={'submit'}
                            size={'xlarge'}
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                            className={'auth-button'}
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </div>

                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={ref}
                            size={'invisible'}
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={(response) => {
                                setToken(response);
                                submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}

                    <div css={tw`mt-5 text-center`}>
                        <Link to={'/auth/password'} css={tw`text-sm no-underline`} className={'auth-link'}>
                            Forgot your password?
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default LoginContainer;
