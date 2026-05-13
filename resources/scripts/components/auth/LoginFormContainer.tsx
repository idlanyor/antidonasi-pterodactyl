import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { motion } from 'framer-motion';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
    description?: string;
};

const Container = styled.div`
    ${tw`flex flex-col items-center justify-center w-full`};
    margin: 0 auto;
`;

const Card = styled(motion.div)`
    ${tw`w-full`};
    padding: 2.5rem 2rem;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);
    z-index: 1;
    position: relative;
`;

const ModernStyles = styled.div`
    ${tw`relative`};

    .auth-label {
        ${tw`text-brand-navy font-bold text-sm mb-2 block tracking-tight`} !important;
        color: #0f172a !important;
    }

    .auth-link {
        ${tw`text-accent-blue text-xs font-bold hover:underline transition-all duration-200`};
        color: #2299dd !important;
    }
`;

const LogoWrapper = styled(motion.div)`
    ${tw`mb-8 flex flex-col items-center`};

    img {
        ${tw`w-16 h-16 rounded-2xl mb-4 shadow-xl`};
        background: #ffffff;
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
    }

    h1 {
        ${tw`text-3xl font-black text-brand-navy tracking-tight text-center`};
        font-family: 'Satoshi', sans-serif;
    }

    p {
        ${tw`text-brand-slate text-sm mt-1 text-center font-bold`};
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ title, description, ...props }, ref) => (
    <Container>
        <LogoWrapper initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <img src={'https://s3.ireng.uk/13800c0f064f58af8d97c5ce065c00b4.png'} alt={'Logo'} />
            <h1>{title || 'Welcome back!'}</h1>
            <p>{description || 'Please enter your details to sign in.'}</p>
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
            <p className={'text-sm text-brand-slate font-bold'}>
                Lihat paket dan harga:{' '}
                <Link
                    to={'/pricing'}
                    className={'text-accent-blue hover:text-accent-blue font-bold underline underline-offset-4'}
                    style={{ textDecorationColor: 'rgba(34, 153, 221, 0.3)' }}
                >
                    Pricelist Panel
                </Link>
            </p>
        </div>
        <motion.p
            css={tw`text-center text-[10px] mt-12 text-neutral-400 uppercase tracking-[0.2em] font-bold`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
        >
            &copy; {new Date().getFullYear()} Antidonasi Creative
        </motion.p>
    </Container>
));
