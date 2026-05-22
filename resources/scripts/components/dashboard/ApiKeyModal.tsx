import React, { useContext } from 'react';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import asModal from '@/hoc/asModal';
import ModalContext from '@/context/ModalContext';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface Props {
    apiKey: string;
}

const ApiKeyModal = ({ apiKey }: Props) => {
    const { dismiss } = useContext(ModalContext);

    return (
        <>
            <h3 css={tw`mb-6 text-3xl font-black tracking-tight`} style={{ color: 'var(--text-primary)' }}>
                Your API Key
            </h3>
            <p css={tw`text-sm mb-8 font-bold leading-relaxed`} style={{ color: 'var(--text-secondary)' }}>
                The API key you have requested is shown below. Please store this in a safe location, it will not be
                shown again.
            </p>
            <pre
                css={tw`text-sm rounded-xl py-4 px-6 font-mono font-bold shadow-inner`}
                style={{
                    backgroundColor: 'var(--bg-code)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                }}
            >
                <CopyOnClick text={apiKey}>
                    <code css={tw`font-mono`}>{apiKey}</code>
                </CopyOnClick>
            </pre>
            <div css={tw`flex justify-end mt-8`}>
                <Button isSecondary type={'button'} onClick={() => dismiss()} size={'large'}>
                    Close
                </Button>
            </div>
        </>
    );
};

ApiKeyModal.displayName = 'ApiKeyModal';

export default asModal<Props>({
    closeOnEscape: false,
    closeOnBackground: false,
})(ApiKeyModal);
