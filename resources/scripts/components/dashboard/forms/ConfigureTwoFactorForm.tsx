import React, { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import SetupTOTPDialog from '@/components/dashboard/forms/SetupTOTPDialog';
import RecoveryTokensDialog from '@/components/dashboard/forms/RecoveryTokensDialog';
import DisableTOTPDialog from '@/components/dashboard/forms/DisableTOTPDialog';
import { useFlashKey } from '@/plugins/useFlash';

export default () => {
    const [tokens, setTokens] = useState<string[]>([]);
    const [visible, setVisible] = useState<'enable' | 'disable' | null>(null);
    const isEnabled = useStoreState((state: ApplicationStore) => state.user.data!.useTotp);
    const { clearAndAddHttpError } = useFlashKey('account:two-step');

    useEffect(() => {
        return () => {
            clearAndAddHttpError();
        };
    }, [visible]);

    const onTokens = (tokens: string[]) => {
        setTokens(tokens);
        setVisible(null);
    };

    return (
        <div>
            <SetupTOTPDialog open={visible === 'enable'} onClose={() => setVisible(null)} onTokens={onTokens} />
            <RecoveryTokensDialog tokens={tokens} open={tokens.length > 0} onClose={() => setTokens([])} />
            <DisableTOTPDialog open={visible === 'disable'} onClose={() => setVisible(null)} />
            <p css={tw`text-sm text-neutral-100 leading-relaxed`}>
                {isEnabled
                    ? 'Two-step verification is currently enabled on your account.'
                    : 'You do not currently have two-step verification enabled on your account. Click the button below to begin configuring it.'}
            </p>
            <div css={tw`mt-6`}>
                {isEnabled ? (
                    <Button.Danger
                        onClick={() => setVisible('disable')}
                        style={{
                            background: 'linear-gradient(135deg, #ff4d4d, #f87171)',
                            border: '1px solid #dc2626',
                            color: '#ffffff',
                            fontWeight: 600,
                            boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.5)',
                            borderRadius: '0.5rem',
                            padding: '0.625rem 1.25rem',
                        }}
                    >
                        Disable Two-Step
                    </Button.Danger>
                ) : (
                    <Button
                        onClick={() => setVisible('enable')}
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            border: '1px solid #1d4ed8',
                            color: '#ffffff',
                            fontWeight: 600,
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)',
                            borderRadius: '0.5rem',
                            padding: '0.625rem 1.25rem',
                        }}
                    >
                        Enable Two-Step
                    </Button>
                )}
            </div>
        </div>
    );
};
