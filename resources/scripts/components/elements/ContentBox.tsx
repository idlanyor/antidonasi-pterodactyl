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
    ${tw`p-4 rounded-xl relative border`};
    background: #111827;
    border-color: #1f2937;
    box-shadow: none;
    color: #e5e7eb;
`;

const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => (
    <div {...props}>
        {title && <h2 css={tw`mb-4 px-1 text-2xl text-neutral-100 font-semibold`}>{title}</h2>}
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
