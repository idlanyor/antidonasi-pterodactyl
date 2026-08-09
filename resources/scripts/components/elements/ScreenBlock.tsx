import React from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import styled, { keyframes } from 'styled-components/macro';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import NotFoundSvg from '@/assets/images/not_found.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';

interface BaseProps {
    title: string;
    image: string;
    message: string;
    onRetry?: () => void;
    onBack?: () => void;
}

interface PropsWithRetry extends BaseProps {
    onRetry?: () => void;
    onBack?: never;
}

interface PropsWithBack extends BaseProps {
    onBack?: () => void;
    onRetry?: never;
}

export type ScreenBlockProps = PropsWithBack | PropsWithRetry;

const spin = keyframes`
    to { transform: rotate(360deg) }
`;

const ActionButton = styled(Button)`
    ${tw`rounded-full w-8 h-8 flex items-center justify-center p-0`};

    &.hover\\:spin:hover {
        animation: ${spin} 2s linear infinite;
    }
`;

const ScreenBlock = ({ title, image, message, onBack, onRetry }: ScreenBlockProps) => (
    <PageContentBlock>
        <div css={tw`flex justify-center`}>
            <div
                css={tw`w-full sm:w-3/4 md:w-1/2 p-12 md:p-20 rounded-xl border text-center relative`}
                style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-primary)',
                    boxShadow: 'var(--shadow-lg)',
                }}
            >
                {(typeof onBack === 'function' || typeof onRetry === 'function') && (
                    <div css={tw`absolute left-0 top-0 ml-6 mt-6`}>
                        <ActionButton
                            onClick={() => (onRetry ? onRetry() : onBack ? onBack() : null)}
                            className={onRetry ? 'hover:spin' : undefined}
                            style={{
                                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent) 100%)',
                                border: 'none',
                                color: '#FFFFFF',
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                boxShadow: 'var(--shadow-btn-primary)',
                            }}
                        >
                            <FontAwesomeIcon icon={onRetry ? faSyncAlt : faArrowLeft} />
                        </ActionButton>
                    </div>
                )}
                <img src={image} css={tw`w-2/3 h-auto select-none mx-auto`} />
                <h2 css={tw`mt-10 font-black text-5xl tracking-tight`} style={{ color: 'var(--text-primary)' }}>
                    {title}
                </h2>
                <p css={tw`text-base mt-4 font-bold leading-relaxed`} style={{ color: 'var(--text-secondary)' }}>
                    {message}
                </p>
            </div>
        </div>
    </PageContentBlock>
);

type ServerErrorProps = (Omit<PropsWithBack, 'image' | 'title'> | Omit<PropsWithRetry, 'image' | 'title'>) & {
    title?: string;
};

const ServerError = ({ title, ...props }: ServerErrorProps) => (
    <ScreenBlock title={title || 'Something went wrong'} image={ServerErrorSvg} {...props} />
);

const NotFound = ({ title, message, onBack }: Partial<Pick<ScreenBlockProps, 'title' | 'message' | 'onBack'>>) => (
    <ScreenBlock
        title={title || '404'}
        image={NotFoundSvg}
        message={message || 'The requested resource was not found.'}
        onBack={onBack}
    />
);

export { ServerError, NotFound };
export default ScreenBlock;
