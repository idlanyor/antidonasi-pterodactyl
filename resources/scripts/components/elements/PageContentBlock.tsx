import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <>
                <ContentContainer css={tw`my-4 sm:my-10`} className={className}>
                    {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                    {children}
                </ContentContainer>
                <ContentContainer css={tw`mb-12`}>
                    <p
                        css={tw`text-center text-[10px] uppercase font-black tracking-[0.2em]`}
                        style={{
                            color: 'var(--text-muted)',
                            fontFamily: "'Satoshi', sans-serif",
                        }}
                    >
                        <a
                            rel={'noopener nofollow noreferrer'}
                            href={'https://pterodactyl.io'}
                            target={'_blank'}
                            css={tw`no-underline transition-colors duration-300`}
                            style={{
                                color: 'var(--text-muted)',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = '#7C3AED';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                            }}
                        >
                            PTERODACTYL
                        </a>
                        &nbsp;&copy; 2015 - {new Date().getFullYear()}
                    </p>
                </ContentContainer>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
