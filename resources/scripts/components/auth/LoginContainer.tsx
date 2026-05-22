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

import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                    window.location = response.intended || '/dashboard';
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
                <LoginFormContainer css={tw`w-full flex`}>
                    <div css={tw`space-y-6`}>
                        <AuthField
                            name={'username'}
                            label={'Username or email address'}
                            type={'text'}
                            icon={<FontAwesomeIcon icon={faUser} />}
                            disabled={isSubmitting}
                        />
                        <div>
                            <div className={'flex items-center justify-between mb-2'}>
                                <label className={'text-neutral-900 font-bold text-sm tracking-tight'}>Password</label>
                                <Link to={'/auth/password'} className={'auth-link'}>
                                    Forgot password?
                                </Link>
                            </div>
                            <AuthField
                                name={'password'}
                                label={''} // Label handled above for GitHub style
                                type={'password'}
                                icon={<FontAwesomeIcon icon={faLock} />}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div css={tw`mt-8`}>
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Sign in to Account'}
                        </Button>
                    </div>

                    <div css={tw`mt-4 text-center`}>
                        <Link to={'/auth/register'} css={tw`text-xs text-neutral-500 font-bold hover:text-neutral-700`}>
                            Don&apos;t have an account? Create one
                        </Link>
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
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default LoginContainer;
