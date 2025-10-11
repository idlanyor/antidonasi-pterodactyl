import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled, { keyframes } from 'styled-components/macro';
import { motion } from 'framer-motion';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    position: relative;
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

const blobPulse = keyframes`
    0% { transform: translateY(0) scale(1); opacity: 0.18; }
    50% { transform: translateY(-6px) scale(1.03); opacity: 0.25; }
    100% { transform: translateY(0) scale(1); opacity: 0.18; }
`;

const BackgroundBlobs = styled.div`
    ${tw`absolute inset-0 pointer-events-none`};
    z-index: 0;
    &::before,
    &::after {
        content: '';
        position: absolute;
        filter: blur(42px);
        border-radius: 50%;
        animation: ${blobPulse} 10s ease-in-out infinite;
        will-change: transform, opacity;
    }
    &::before {
        width: 320px;
        height: 320px;
        background: radial-gradient(closest-side, rgba(59, 130, 246, 0.45), rgba(59, 130, 246, 0));
        top: -80px;
        left: -80px;
    }
    &::after {
        width: 280px;
        height: 280px;
        background: radial-gradient(closest-side, rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));
        bottom: -70px;
        right: -70px;
        animation-delay: 0.8s;
    }
`;

const Card = styled(motion.div)`
    ${tw`w-full bg-white shadow-xl rounded-2xl p-6 mx-1 border`};
    border-color: rgba(59, 130, 246, 0.2);
    z-index: 1;
    transition: transform 250ms ease, box-shadow 250ms ease;
`;

const NeonStyles = styled.div`
    ${tw`relative`};
    /* Blue & white theme */
    .auth-label {
        color: #1d4ed8 !important; /* blue-700 */
    }
    .auth-input {
        background-color: #ffffff !important;
        color: #0f172a !important; /* slate-900 */
        border: 1px solid rgba(59, 130, 246, 0.6) !important; /* blue-500 */
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    }
    .auth-input:focus {
        border-color: rgba(37, 99, 235, 0.95) !important; /* blue-600 */
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25) !important; /* blue-500 ring */
    }
    .auth-input.auth-error {
        border-color: rgba(239, 68, 68, 0.95) !important; /* red-600 */
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25) !important; /* red ring */
    }
    .auth-button {
        color: #ffffff !important;
        border: 1px solid rgba(37, 99, 235, 0.8) !important;
        background-image: linear-gradient(135deg, #3b82f6, #2563eb);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
    }
    .auth-button:hover {
        filter: brightness(1.05);
        transform: translateY(-1px);
    }
    .auth-link {
        color: #2563eb !important; /* blue-600 */
    }
    .auth-link:hover {
        color: #1d4ed8 !important; /* blue-700 */
        text-decoration: underline;
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ ...props }, ref) => (
    <Container>
        <div className={'flex items-center bg-white justify-center mb-6 rounded-xl mx-2'}>
            <div className={'flex items-center space-x-4 py-5 px-2'}>
                <img
                    src={'https://files.catbox.moe/5lzdmq.png'}
                    alt={'Antidonasi Creative'}
                    className={'w-20 h-20 rounded-full object-cover shadow-md'}
                />
                <div>
                    <p className={'text-xl font-semibold leading-tight text-primary-700 lg:text-xl'}>
                        Antidonasi Creative
                    </p>
                    <p className={'text-xs text-primary-500 tracking-wide lg:text-sm'}>
                        Layanan VPS dan Panel Pterodactyl
                    </p>
                    <p className={'text-xs text-primary-500 tracking-wide lg:text-sm'}>Murah dan Terpercaya</p>
                </div>
            </div>
        </div>
        <FlashMessageRender css={tw`mb-2 px-1`} />
        <Form {...props} ref={ref}>
            <BackgroundBlobs />
            <Card
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -3, boxShadow: '0 14px 35px rgba(0,0,0,0.16)' }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
            >
                <NeonStyles>
                    <div css={tw`w-full`}>{props.children}</div>
                </NeonStyles>
            </Card>
        </Form>
        <p css={tw`text-center text-primary-500 text-xs mt-4`}>
            © {new Date().getFullYear()} Antidonasi Creative — All rights reserved
        </p>
    </Container>
));
