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
                <ContentContainer css={tw`mb-4`}>
                    <p
                        css={tw`text-center text-xs`}
                        style={{
                            color: 'rgba(255, 215, 0, 0.5)',
                            fontFamily: 'monospace',
                            letterSpacing: '0.05em',
                        }}
                    >
                        <a
                            rel={'noopener nofollow noreferrer'}
                            href={'https://pterodactyl.io'}
                            target={'_blank'}
                            css={tw`no-underline`}
                            style={{
                                color: 'rgba(255, 215, 0, 0.5)',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = '#ffd700';
                                e.currentTarget.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = 'rgba(255, 215, 0, 0.5)';
                                e.currentTarget.style.textShadow = 'none';
                            }}
                        >
                            &lt;PTERODACTYL/&gt;
                        </a>
                        &nbsp;// 2015 - {new Date().getFullYear()}
                    </p>
                </ContentContainer>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
