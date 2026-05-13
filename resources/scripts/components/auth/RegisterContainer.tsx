import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import register from '@/api/auth/register';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string, ref } from 'yup';
import AuthField from '@/components/auth/AuthField';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import { faEnvelope, faLock, faUser, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Values {
    username: string;
    email: string;
    name_first: string;
    name_last: string;
    password: string;
    password_confirmation: string;
}

const RegisterContainer = () => {
    const recaptchaRef = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            recaptchaRef.current!.execute().catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
            return;
        }

        register({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.success) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/dashboard';
                }
            })
            .catch((error) => {
                console.error(error);
                setToken('');
                if (recaptchaRef.current) recaptchaRef.current.reset();
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{
                username: '',
                email: '',
                name_first: '',
                name_last: '',
                password: '',
                password_confirmation: '',
            }}
            validationSchema={object().shape({
                username: string().required('A username must be provided.').min(3),
                email: string().required('A valid email address must be provided.').email(),
                name_first: string().required('First name is required.'),
                name_last: string().required('Last name is required.'),
                password: string().required('Password is required.').min(8),
                password_confirmation: string()
                    .required('Please confirm your password.')
                    .oneOf([ref('password')], 'Passwords must match'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer
                    title={'Create Account'}
                    description={'Please fill in the form below to create an account.'}
                    css={tw`w-full flex`}
                >
                    <div css={tw`space-y-4`}>
                        <div css={tw`flex space-x-4`}>
                            <AuthField
                                name={'name_first'}
                                label={'First Name'}
                                type={'text'}
                                icon={<FontAwesomeIcon icon={faIdCard} />}
                                disabled={isSubmitting}
                            />
                            <AuthField
                                name={'name_last'}
                                label={'Last Name'}
                                type={'text'}
                                icon={<FontAwesomeIcon icon={faIdCard} />}
                                disabled={isSubmitting}
                            />
                        </div>
                        <AuthField
                            name={'username'}
                            label={'Username'}
                            type={'text'}
                            icon={<FontAwesomeIcon icon={faUser} />}
                            disabled={isSubmitting}
                        />
                        <AuthField
                            name={'email'}
                            label={'Email Address'}
                            type={'email'}
                            icon={<FontAwesomeIcon icon={faEnvelope} />}
                            disabled={isSubmitting}
                        />
                        <AuthField
                            name={'password'}
                            label={'Password'}
                            type={'password'}
                            icon={<FontAwesomeIcon icon={faLock} />}
                            disabled={isSubmitting}
                        />
                        <AuthField
                            name={'password_confirmation'}
                            label={'Confirm Password'}
                            type={'password'}
                            icon={<FontAwesomeIcon icon={faLock} />}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div css={tw`mt-8`}>
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </div>

                    <div css={tw`mt-4 text-center`}>
                        <Link to={'/auth/login'} css={tw`text-xs text-neutral-500 font-bold hover:text-neutral-700`}>
                            Already have an account? Sign In
                        </Link>
                    </div>

                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={recaptchaRef}
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

export default RegisterContainer;
