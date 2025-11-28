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

const Glass = styled.div`
    ${tw`p-4 rounded-lg shadow-lg relative`};
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(245, 133, 41, 0.4);
    box-shadow: 0 8px 25px rgba(245, 133, 41, 0.2), 0 4px 15px rgba(221, 42, 123, 0.15);
    backdrop-filter: blur(10px);
    color: #2d3748;
`;

const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => (
    <div {...props}>
        {title && (
            <h2 css={tw`mb-4 px-4 text-2xl`} style={{ color: '#000000', fontWeight: 700 }}>
                {title}
            </h2>
        )}
        {showFlashes && (
            <FlashMessageRender byKey={typeof showFlashes === 'string' ? showFlashes : undefined} css={tw`mb-4`} />
        )}
        <Glass css={[!!borderColor && tw`border-t-4`]} style={borderColor ? { borderTopColor: borderColor } : {}}>
            <SpinnerOverlay visible={showLoadingOverlay || false} />
            {children}
        </Glass>
    </div>
);

export default ContentBox;
