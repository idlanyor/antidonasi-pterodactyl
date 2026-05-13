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
    ${tw`p-6 rounded-xl relative border shadow-lg`};
    background-color: #ffffff;
    border-color: #e2e8f0;
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);
    color: #0f172a;
    transition: all 0.3s ease-in-out;

    &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 -12px 36px 0 rgba(15, 23, 42, 0.12);
    }
`;

const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => (
    <div {...props}>
        {title && <h2 css={tw`mb-4 px-2 text-xl text-brand-navy font-bold tracking-tight`}>{title}</h2>}
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
