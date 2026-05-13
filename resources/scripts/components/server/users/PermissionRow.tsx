import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Checkbox from '@/components/elements/Checkbox';
import React from 'react';
import { useStoreState } from 'easy-peasy';

const Container = styled.label`
    ${tw`flex items-center border border-transparent rounded-xl p-2 transition-all duration-300`};
    text-transform: none;

    &:not(.disabled) {
        ${tw`cursor-pointer`};

        &:hover {
            ${tw`border-neutral-200 bg-neutral-50`};
        }
    }

    &.disabled {
        ${tw`opacity-50`};
    }
`;

interface Props {
    permission: string;
    disabled: boolean;
}

const PermissionRow = ({ permission, disabled }: Props) => {
    const [key, pkey] = permission.split('.', 2);
    const permissions = useStoreState((state) => state.permissions.data);

    return (
        <Container htmlFor={`permission_${permission}`} className={disabled ? 'disabled' : undefined}>
            <div css={tw`p-2`}>
                <Checkbox id={`permission_${permission}`} name={'permissions'} value={permission} disabled={disabled} />
            </div>
            <div css={tw`flex-1 ml-2`}>
                <p css={tw`text-sm font-black text-brand-navy tracking-tight`}>{pkey}</p>
                {permissions[key].keys[pkey].length > 0 && (
                    <p css={tw`text-[11px] text-brand-slate font-bold mt-0.5 leading-relaxed`}>
                        {permissions[key].keys[pkey]}
                    </p>
                )}
            </div>
        </Container>
    );
};

export default PermissionRow;
