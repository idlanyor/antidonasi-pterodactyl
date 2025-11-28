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
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    padding: 1rem;

    ${breakpoint('md')`
        max-width: 500px;
    `};
`;

const gradientShift = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
`;

const Card = styled(motion.div)`
    ${tw`w-full`};
    padding: 1.5rem 1.25rem;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    box-shadow: 0 12px 35px rgba(245, 133, 41, 0.2), 0 6px 18px rgba(221, 42, 123, 0.15),
        0 0 0 1px rgba(245, 133, 41, 0.15);
    z-index: 1;
    position: relative;
    overflow: hidden;

    ${breakpoint('md')`
        padding: 1.75rem 1.75rem;
    `};

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #f58529 0%, #dd2a7b 33%, #8134af 66%, #f58529 100%);
        background-size: 200% 100%;
        animation: ${gradientShift} 3s linear infinite;
    }
`;

const ModernStyles = styled.div`
    ${tw`relative`};

    .auth-label {
        color: #2d3748 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        font-weight: 600;
        letter-spacing: 0.02em;
        font-size: 0.8rem;
        margin-bottom: 0.4rem;
        transition: all 0.2s ease;
    }

    .auth-input {
        background: rgba(247, 250, 252, 0.8) !important;
        color: #2d3748 !important;
        border: 2px solid #e2e8f0 !important;
        box-shadow: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 0.9rem;
        padding: 0.7rem 0.875rem;
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &::placeholder {
            color: #a0aec0 !important;
        }

        &:hover {
            border-color: #cbd5e0 !important;
            background: rgba(255, 255, 255, 0.9) !important;
        }
    }

    .auth-input:focus {
        border-color: #dd2a7b !important;
        background: #ffffff !important;
        box-shadow: 0 0 0 3px rgba(221, 42, 123, 0.15) !important;
        transform: translateY(-1px);
    }

    .auth-input.auth-error {
        border-color: #fc8181 !important;
        box-shadow: 0 0 0 3px rgba(252, 129, 129, 0.1) !important;
    }

    .auth-button {
        color: #ffffff !important;
        font-weight: 600;
        border: none !important;
        background: linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%) !important;
        letter-spacing: 0.025em;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 0.95rem;
        padding: 0.75rem 1.5rem !important;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(245, 133, 41, 0.35), 0 4px 12px rgba(221, 42, 123, 0.25);
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s ease;
        }

        &:hover::before {
            left: 100%;
        }
    }

    .auth-button:hover {
        background: linear-gradient(135deg, #8134af 0%, #dd2a7b 50%, #f58529 100%) !important;
        box-shadow: 0 12px 30px rgba(245, 133, 41, 0.45), 0 6px 18px rgba(221, 42, 123, 0.35);
        transform: translateY(-2px);
    }

    .auth-button:active {
        transform: translateY(0px);
    }

    .auth-link {
        color: #dd2a7b !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-weight: 500;
        letter-spacing: 0.02em;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        display: inline-block;

        &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #f58529, #dd2a7b, #8134af);
            transition: width 0.3s ease;
        }
    }

    .auth-link:hover {
        color: #8134af !important;
        text-decoration: none;

        &::after {
            width: 100%;
        }
    }
`;

const LogoContainer = styled(motion.div)`
    background: linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%);
    border-radius: 16px;
    box-shadow: 0 15px 35px rgba(245, 133, 41, 0.35), 0 8px 20px rgba(221, 42, 123, 0.25);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
        animation: ${float} 6s ease-in-out infinite;
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ ...props }, ref) => (
    <Container>
        <LogoContainer
            className={'flex items-center justify-center mb-4'}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className={'flex items-center space-x-3 py-4 px-5'}>
                <motion.img
                    src={'https://files.catbox.moe/5lzdmq.png'}
                    alt={'Antidonasi Creative'}
                    className={'w-12 h-12 rounded-full object-cover'}
                    style={{
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                />
                <div>
                    <motion.p
                        className={'text-base font-bold leading-tight'}
                        style={{
                            color: '#ffffff',
                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                            letterSpacing: '0.02em',
                            fontWeight: 700,
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        ANTIDONASI CREATIVE
                    </motion.p>
                    <motion.p
                        className={'text-xs mt-0.5'}
                        style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                            fontWeight: 400,
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Layanan VPS dan Panel Pterodactyl
                    </motion.p>
                </div>
            </div>
        </LogoContainer>
        <FlashMessageRender css={tw`mb-3 px-1`} />
        <Form {...props} ref={ref}>
            <Card
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
                <ModernStyles>
                    <div css={tw`w-full`}>{props.children}</div>
                </ModernStyles>
            </Card>
        </Form>
        <motion.p
            css={tw`text-center text-xs mt-4`}
            style={{
                color: '#000000ff',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 400,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
        >
            © {new Date().getFullYear()} Antidonasi Creative
        </motion.p>
    </Container>
));
