import React from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';
import styled from 'styled-components/macro';

type Props = Readonly<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        title?: string;
        borderColor?: string;
        showFlashes?: string | boolean;
        showLoadingOverlay?: boolean;
    }
>;

const Card = styled.div`
    ${tw`p-6 rounded-xl relative border`};
    background-color: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);
    color: var(--text-primary);
    transition: all 0.3s ease-in-out;

    &:hover {
        border-color: var(--border-secondary);
        box-shadow: var(--shadow-lg-hover);
    }
`;

const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => (
    <div {...props}>
        {title && (
            <h2
                css={tw`mb-4 px-2 text-xl font-bold tracking-tight`}
                style={{ color: 'var(--text-primary)' }}
            >
                {title}
            </h2>
        )}
        {showFlashes && (
            <FlashMessageRender byKey={typeof showFlashes === 'string' ? showFlashes : undefined} css={tw`mb-4`} />
        )}
        <Card css={[!!borderColor && tw`border-t-4`]} style={borderColor ? { borderTopColor: borderColor } : {}}>
            <SpinnerOverlay visible={showLoadingOverlay || false} />
            {children}
        </Card>
    </div>
);

export default ContentBox;
