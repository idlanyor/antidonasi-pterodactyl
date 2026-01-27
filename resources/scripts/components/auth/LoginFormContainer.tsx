import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { motion } from 'framer-motion';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${tw`flex flex-col items-center justify-center min-h-screen`};
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
    padding: 1.25rem;
`;

const Card = styled(motion.div)`
    ${tw`w-full`};
    padding: 1.25rem;
    ${tw`bg-neutral-900 border border-neutral-800 rounded-xl`};
    z-index: 1;
    position: relative;
`;

const ModernStyles = styled.div`
    ${tw`relative`};

    .auth-label {
        ${tw`text-neutral-300 font-normal text-sm mb-2 block normal-case tracking-normal`} !important;
        text-transform: none !important;
        letter-spacing: normal !important;
        color: #d4d4d4 !important;
    }

    .auth-input {
        ${tw`w-full bg-neutral-900 text-neutral-100 border border-neutral-800 rounded-md px-3 py-2 text-sm transition-all duration-200`};
        ${tw`focus:border-blue-500 focus:ring-0 outline-none`};
        padding-left: 0.75rem !important; /* Override StyledInput padding if icon is not used */

        &::placeholder {
            ${tw`text-neutral-600`};
        }
    }

    .auth-input.auth-error {
        ${tw`border-red-500`};
    }

    .auth-button {
        ${tw`w-full bg-blue-600 text-white font-semibold rounded-md py-2 text-sm transition-all duration-200 mt-4`};
        ${tw`hover:bg-blue-500 active:bg-blue-700`};
    }

    .auth-link {
        ${tw`text-blue-400 text-xs hover:underline transition-all duration-200`};
    }
`;

const LogoWrapper = styled(motion.div)`
    ${tw`mb-6 flex flex-col items-center`};
`;

export default forwardRef<HTMLFormElement, Props>(({ ...props }, ref) => (
    <Container>
        <LogoWrapper initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <img src={'https://files.catbox.moe/5lzdmq.png'} alt={'Logo'} className={'w-12 h-12 rounded-full mb-4'} />
            <h1 className={'text-xl font-semibold text-neutral-100 tracking-tight'}>Sign in to Antidonasi</h1>
        </LogoWrapper>
        <FlashMessageRender css={tw`mb-4 w-full`} />
        <Form {...props} ref={ref} className={'w-full'}>
            <Card initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <ModernStyles>
                    <div css={tw`w-full`}>{props.children}</div>
                </ModernStyles>
            </Card>
        </Form>
        <div className={'mt-4 w-full border border-neutral-800 rounded-lg p-4 text-center bg-neutral-900'}>
            <p className={'text-sm text-neutral-400'}>
                Lihat paket dan harga:{' '}
                <Link to={'/pricing'} className={'text-blue-400 hover:underline'}>
                    Pricelist Panel
                </Link>
                .
            </p>
        </div>
        <motion.p
            css={tw`text-center text-xs mt-8 text-neutral-600`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            &copy; {new Date().getFullYear()} Antidonasi Creative
        </motion.p>
    </Container>
));
