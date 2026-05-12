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
    ${tw`flex flex-col items-center justify-center w-full`};
    margin: 0 auto;
`;

const Card = styled(motion.div)`
    ${tw`w-full`};
    padding: 2.5rem 2rem;
    background: rgba(17, 24, 39, 0.7);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    z-index: 1;
    position: relative;
`;

const ModernStyles = styled.div`
    ${tw`relative`};

    .auth-label {
        ${tw`text-neutral-400 font-medium text-xs mb-2 block uppercase tracking-wider`} !important;
        color: #9ca3af !important;
    }

    .auth-input {
        ${tw`w-full text-neutral-100 border border-neutral-800 rounded-xl px-4 py-3 text-sm transition-all duration-200`};
        background-color: rgba(17, 24, 39, 0.5);
        ${tw`focus:border-indigo-500 focus:ring-4 outline-none`};
        &:focus {
            --tw-ring-color: rgba(99, 102, 241, 0.1);
        }

        &::placeholder {
            ${tw`text-neutral-600`};
        }
    }

    .auth-input.auth-error {
        ${tw`focus:border-red-500 focus:ring-red-500`};
        border-color: rgba(239, 68, 68, 0.5);
        &:focus {
            --tw-ring-opacity: 0.1;
        }
    }

    .auth-button {
        ${tw`w-full text-white font-bold rounded-xl py-3 text-sm transition-all duration-300 mt-6 shadow-lg`};
        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
        border: none;
        box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.2), 0 4px 6px -2px rgba(99, 102, 241, 0.1);

        &:hover {
            box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.4), 0 10px 10px -5px rgba(99, 102, 241, 0.2);
            transform: translateY(-1px);
            filter: brightness(1.1);
        }
        &:active {
            transform: translateY(0);
        }

        &:disabled {
            ${tw`opacity-50 cursor-not-allowed`};
            transform: none;
        }
    }

    .auth-link {
        ${tw`text-indigo-400 text-xs font-medium hover:text-indigo-300 transition-all duration-200`};
    }
`;

const LogoWrapper = styled(motion.div)`
    ${tw`mb-8 flex flex-col items-center`};

    img {
        ${tw`w-16 h-16 rounded-2xl mb-4 shadow-2xl`};
        background: rgba(255, 255, 255, 0.05);
        padding: 0.5rem;
    }

    h1 {
        ${tw`text-2xl font-bold text-white tracking-tight text-center`};
    }

    p {
        ${tw`text-neutral-400 text-sm mt-1 text-center`};
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ ...props }, ref) => (
    <Container>
        <LogoWrapper initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <img src={'https://files.catbox.moe/5lzdmq.png'} alt={'Logo'} />
            <h1>Welcome back!</h1>
            <p>Please enter your details to sign in.</p>
        </LogoWrapper>
        <FlashMessageRender css={tw`mb-4 w-full`} />
        <Form {...props} ref={ref} className={'w-full'}>
            <Card
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <ModernStyles>
                    <div css={tw`w-full`}>{props.children}</div>
                </ModernStyles>
            </Card>
        </Form>
        <div className={'mt-8 w-full text-center'}>
            <p className={'text-sm text-neutral-400'}>
                Lihat paket dan harga:{' '}
                <Link
                    to={'/pricing'}
                    className={'text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4'}
                    style={{ textDecorationColor: 'rgba(129, 140, 248, 0.3)' }}
                >
                    Pricelist Panel
                </Link>
            </p>
        </div>
        <motion.p
            css={tw`text-center text-[10px] mt-12 text-neutral-600 uppercase tracking-[0.2em] font-medium`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
        >
            &copy; {new Date().getFullYear()} Antidonasi Creative
        </motion.p>
    </Container>
));
