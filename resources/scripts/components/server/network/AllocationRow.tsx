import React, { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import InputSpinner from '@/components/elements/InputSpinner';
import { Textarea } from '@/components/elements/Input';
import Can from '@/components/elements/Can';
import Button from '@/components/elements/Button';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { Allocation } from '@/api/server/getServer';
import styled from 'styled-components/macro';
import { debounce } from 'debounce';
import setServerAllocationNotes from '@/api/server/network/setServerAllocationNotes';
import { useFlashKey } from '@/plugins/useFlash';
import { ServerContext } from '@/state/server';
import CopyOnClick from '@/components/elements/CopyOnClick';
import DeleteAllocationButton from '@/components/server/network/DeleteAllocationButton';
import setPrimaryServerAllocation from '@/api/server/network/setPrimaryServerAllocation';
import getServerAllocations from '@/api/swr/getServerAllocations';
import { ip } from '@/lib/formatters';
import Code from '@/components/elements/Code';

const Label = styled.label`
    ${tw`uppercase text-[10px] mt-1 block px-1 select-none transition-colors duration-150`}
    color: var(--text-secondary);
    font-weight: 700;
    letter-spacing: 0.05em;
`;

interface Props {
    allocation: Allocation;
}

const AllocationRow = ({ allocation }: Props) => {
    const [loading, setLoading] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlashKey('server:network');
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { mutate } = getServerAllocations();

    const onNotesChanged = useCallback((id: number, notes: string) => {
        mutate((data) => data?.map((a) => (a.id === id ? { ...a, notes } : a)), false);
    }, []);

    const setAllocationNotes = debounce((notes: string) => {
        setLoading(true);
        clearFlashes();

        setServerAllocationNotes(uuid, allocation.id, notes)
            .then(() => onNotesChanged(allocation.id, notes))
            .catch((error) => clearAndAddHttpError(error))
            .then(() => setLoading(false));
    }, 750);

    const setPrimaryAllocation = () => {
        clearFlashes();
        mutate((data) => data?.map((a) => ({ ...a, isDefault: a.id === allocation.id })), false);

        setPrimaryServerAllocation(uuid, allocation.id).catch((error) => {
            clearAndAddHttpError(error);
            mutate();
        });
    };

    return (
        <GreyRowBox $hoverable={false} className={'flex-wrap md:flex-nowrap'}>
            <div className={'flex items-center w-full md:w-auto'}>
                <div className={'pl-4 pr-6'} style={{ color: 'var(--accent)' }}>
                    <FontAwesomeIcon icon={faNetworkWired} />
                </div>
                <div className={'mr-4 flex-1 md:w-48'}>
                    {allocation.alias ? (
                        <CopyOnClick text={allocation.alias}>
                            <Code dark>{allocation.alias}</Code>
                        </CopyOnClick>
                    ) : (
                        <CopyOnClick text={ip(allocation.ip)}>
                            <Code dark>{ip(allocation.ip)}</Code>
                        </CopyOnClick>
                    )}
                    <Label>{allocation.alias ? 'Hostname' : 'IP Address'}</Label>
                </div>
                <div className={'w-16 md:w-28 overflow-hidden'}>
                    <Code>{allocation.port}</Code>
                    <Label>Port</Label>
                </div>
            </div>
            <div className={'mt-4 w-full md:mt-0 md:flex-1 md:w-auto'}>
                <InputSpinner visible={loading}>
                    <Textarea
                        style={{
                            background: 'var(--bg-elevated)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)',
                            borderRadius: '10px',
                            minHeight: '44px',
                            padding: '10px 14px',
                        }}
                        placeholder={'Add notes for this allocation...'}
                        defaultValue={allocation.notes || undefined}
                        onChange={(e) => setAllocationNotes(e.currentTarget.value)}
                    />
                </InputSpinner>
            </div>
            <div className={'flex justify-end items-center gap-3 mt-4 w-full md:mt-0 md:ml-6 md:w-auto'}>
                {allocation.isDefault ? (
                    <span
                        css={tw`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-status-success bg-opacity-10 text-status-success border border-status-success border-opacity-20`}
                    >
                        Primary
                    </span>
                ) : (
                    <>
                        <Can action={'allocation.delete'}>
                            <DeleteAllocationButton allocation={allocation.id} />
                        </Can>
                        <Can action={'allocation.update'}>
                            <Button isSecondary size={'small'} onClick={setPrimaryAllocation}>
                                Make Primary
                            </Button>
                        </Can>
                    </>
                )}
            </div>
        </GreyRowBox>
    );
};

export default memo(AllocationRow, isEqual);
