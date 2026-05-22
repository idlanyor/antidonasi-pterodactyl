import React, { useState } from 'react';
import { Subuser } from '@/state/server/subusers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faUnlockAlt, faUserLock } from '@fortawesome/free-solid-svg-icons';
import RemoveSubuserButton from '@/components/server/users/RemoveSubuserButton';
import EditSubuserModal from '@/components/server/users/EditSubuserModal';
import Can from '@/components/elements/Can';
import { useStoreState } from 'easy-peasy';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';

interface Props {
    subuser: Subuser;
}

export default ({ subuser }: Props) => {
    const uuid = useStoreState((state) => state.user!.data!.uuid);
    const [visible, setVisible] = useState(false);

    return (
        <GreyRowBox css={tw`mb-0`}>
            <EditSubuserModal subuser={subuser} visible={visible} onModalDismissed={() => setVisible(false)} />
            <div
                css={tw`w-12 h-12 rounded-2xl bg-white border border-neutral-200 overflow-hidden hidden md:block shadow-sm`}
            >
                <img css={tw`w-full h-full p-1`} src={`${subuser.image}?s=400`} />
            </div>
            <div css={tw`ml-6 flex-1 overflow-hidden`}>
                <p css={tw`text-base font-black text-neutral-900 tracking-tight truncate`}>{subuser.email}</p>
            </div>
            <div css={tw`ml-6`}>
                <p css={tw`font-black text-center text-neutral-900`}>
                    <FontAwesomeIcon
                        icon={subuser.twoFactorEnabled ? faUserLock : faUnlockAlt}
                        fixedWidth
                        css={!subuser.twoFactorEnabled ? tw`text-status-error` : tw`text-status-success`}
                    />
                </p>
                <p css={tw`text-[10px] text-neutral-500 uppercase font-bold tracking-widest hidden md:block mt-1`}>
                    2FA Status
                </p>
            </div>
            <div css={tw`ml-8 hidden md:block`}>
                <p css={tw`font-black text-center text-neutral-900`}>
                    {subuser.permissions.filter((permission) => permission !== 'websocket.connect').length}
                </p>
                <p css={tw`text-[10px] text-neutral-500 uppercase font-bold tracking-widest mt-1`}>Permissions</p>
            </div>
            {subuser.uuid !== uuid && (
                <div css={tw`flex items-center ml-6 gap-2`}>
                    <Can action={'user.update'}>
                        <button
                            type={'button'}
                            aria-label={'Edit subuser'}
                            css={tw`flex items-center justify-center w-10 h-10 rounded-xl text-neutral-500 hover:text-accent-purple hover:bg-neutral-50 transition-all duration-300`}
                            onClick={() => setVisible(true)}
                        >
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                    </Can>
                    <Can action={'user.delete'}>
                        <RemoveSubuserButton subuser={subuser} />
                    </Can>
                </div>
            )}
        </GreyRowBox>
    );
};
