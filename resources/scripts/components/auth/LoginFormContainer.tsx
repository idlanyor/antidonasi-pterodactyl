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
    0% { transform: translateY(0) scale(1); opacity: 0.3; }
    50% { transform: translateY(-8px) scale(1.05); opacity: 0.5; }
    100% { transform: translateY(0) scale(1); opacity: 0.3; }
`;

const glitchFlicker = keyframes`
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.8; transform: translateX(-2px); }
    94% { opacity: 1; transform: translateX(0); }
    95% { opacity: 0.9; transform: translateX(1px); }
    96% { opacity: 1; transform: translateX(0); }
`;

const scanline = keyframes`
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
`;

const BackgroundBlobs = styled.div`
    ${tw`absolute inset-0 pointer-events-none`};
    z-index: 0;
    &::before,
    &::after {
        content: '';
        position: absolute;
        filter: blur(60px);
        border-radius: 50%;
        animation: ${blobPulse} 8s ease-in-out infinite;
        will-change: transform, opacity;
    }
    &::before {
        width: 350px;
        height: 350px;
        background: radial-gradient(closest-side, rgba(255, 215, 0, 0.4), rgba(255, 215, 0, 0));
        top: -100px;
        left: -100px;
    }
    &::after {
        width: 300px;
        height: 300px;
        background: radial-gradient(closest-side, rgba(255, 51, 51, 0.4), rgba(255, 51, 51, 0));
        bottom: -80px;
        right: -80px;
        animation-delay: 1s;
    }
`;

const Card = styled(motion.div)`
    ${tw`w-full shadow-2xl rounded-lg p-6 mx-1 border`};
    background: rgba(20, 10, 10, 0.95);
    border-color: rgba(255, 215, 0, 0.3);
    z-index: 1;
    transition: transform 250ms ease, box-shadow 250ms ease;
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.2), 0 0 60px rgba(255, 51, 51, 0.1);
    animation: ${glitchFlicker} 10s infinite;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #ffd700, #ff3333, transparent);
        opacity: 0.8;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%);
        background-size: 100% 4px;
        pointer-events: none;
        opacity: 0.1;
    }
`;

const NeonStyles = styled.div`
    ${tw`relative`};
    /* Cyberpunk neon theme - Yellow/Red */
    .auth-label {
        color: #ffd700 !important; /* neon yellow */
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        font-family: monospace;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 0.75rem;
    }
    .auth-input {
        background-color: rgba(20, 10, 10, 0.8) !important;
        color: #ffd700 !important;
        border: 1px solid rgba(255, 215, 0, 0.4) !important;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.1);
        font-family: monospace;

        &::placeholder {
            color: rgba(255, 215, 0, 0.4) !important;
        }
    }
    .auth-input:focus {
        border-color: #ffd700 !important;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.1) !important;
    }
    .auth-input.auth-error {
        border-color: #ff3333 !important;
        box-shadow: 0 0 20px rgba(255, 51, 51, 0.4), inset 0 0 10px rgba(255, 51, 51, 0.1) !important;
    }
    .auth-button {
        color: #000000 !important;
        font-weight: bold;
        border: 2px solid #ffd700 !important;
        background: linear-gradient(135deg, #ffd700, #ffcc00) !important;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        font-family: monospace;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2);
        text-shadow: none;
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transform: rotate(45deg);
            animation: ${scanline} 3s linear infinite;
        }
    }
    .auth-button:hover {
        background: linear-gradient(135deg, #ff3333, #cc0000) !important;
        border-color: #ff3333 !important;
        box-shadow: 0 0 40px rgba(255, 51, 51, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2);
        transform: translateY(-2px) scale(1.02);
    }
    .auth-link {
        color: #ff3333 !important;
        text-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
        font-family: monospace;
        letter-spacing: 0.05em;
    }
    .auth-link:hover {
        color: #ffd700 !important;
        text-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
        text-decoration: none;
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ ...props }, ref) => (
    <Container>
        <div
            className={'flex items-center justify-center mb-6 rounded-lg mx-2 border'}
            style={{
                background: 'rgba(20, 10, 10, 0.9)',
                borderColor: 'rgba(255, 51, 51, 0.3)',
                boxShadow: '0 0 20px rgba(255, 51, 51, 0.2)',
            }}
        >
            <div className={'flex items-center space-x-4 py-5 px-4'}>
                <img
                    src={'https://files.catbox.moe/5lzdmq.png'}
                    alt={'Antidonasi Creative'}
                    className={'w-20 h-20 rounded-full object-cover'}
                    style={{
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 51, 51, 0.3)',
                        border: '2px solid rgba(255, 215, 0, 0.5)',
                    }}
                />
                <div>
                    <p
                        className={'text-xl font-bold leading-tight lg:text-xl'}
                        style={{
                            color: '#ffd700',
                            textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
                            fontFamily: 'monospace',
                            letterSpacing: '0.1em',
                        }}
                    >
                        ANTIDONASI CREATIVE
                    </p>
                    <p
                        className={'text-xs tracking-wide lg:text-sm'}
                        style={{
                            color: '#ff3333',
                            textShadow: '0 0 8px rgba(255, 51, 51, 0.5)',
                            fontFamily: 'monospace',
                        }}
                    >
                        Layanan VPS dan Panel Pterodactyl
                    </p>
                    <p
                        className={'text-xs tracking-wide lg:text-sm'}
                        style={{
                            color: 'rgba(255, 215, 0, 0.7)',
                            fontFamily: 'monospace',
                        }}
                    >
                        &gt;&gt; Murah dan Terpercaya_
                    </p>
                </div>
            </div>
        </div>
        <FlashMessageRender css={tw`mb-2 px-1`} />
        <Form {...props} ref={ref}>
            <BackgroundBlobs />
            <Card
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{
                    y: -5,
                    boxShadow: '0 0 50px rgba(255, 215, 0, 0.4), 0 0 80px rgba(255, 51, 51, 0.2)',
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <NeonStyles>
                    <div css={tw`w-full`}>{props.children}</div>
                </NeonStyles>
            </Card>
        </Form>
        <p
            css={tw`text-center text-xs mt-4`}
            style={{
                color: 'rgba(255, 215, 0, 0.6)',
                textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
            }}
        >
            &lt;/ {new Date().getFullYear()} ANTIDONASI CREATIVE — ALL_RIGHTS_RESERVED /&gt;
        </p>
    </Container>
));
