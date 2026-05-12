import React from 'react';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { ServerContext } from '@/state/server';
import { useStoreState } from 'easy-peasy';
import RenameServerBox from '@/components/server/settings/RenameServerBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import Can from '@/components/elements/Can';
import ReinstallServerBox from '@/components/server/settings/ReinstallServerBox';
import tw from 'twin.macro';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { ip } from '@/lib/formatters';
import { Button } from '@/components/elements/button/index';

export default () => {
    const username = useStoreState((state) => state.user.data!.username);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const node = ServerContext.useStoreState((state) => state.server.data!.node);
    const sftp = ServerContext.useStoreState((state) => state.server.data!.sftpDetails, isEqual);

    return (
        <ServerContentBlock title={'Settings'}>
            <FlashMessageRender byKey={'settings'} css={tw`mb-4`} />
            <div css={tw`md:flex`}>
                <div css={tw`w-full md:flex-1 md:mr-10`}>
                    <Can action={'file.sftp'}>
                        <TitledGreyBox title={'SFTP Details'} css={tw`mb-6 md:mb-10`} glass>
                            <div>
                                <Label>Server Address</Label>
                                <CopyOnClick text={`sftp://${ip(sftp.ip)}:${sftp.port}`}>
                                    <Input
                                        type={'text'}
                                        value={`sftp://${ip(sftp.ip)}:${sftp.port}`}
                                        readOnly
                                        variant={'glass'}
                                    />
                                </CopyOnClick>
                            </div>
                            <div css={tw`mt-6`}>
                                <Label>Username</Label>
                                <CopyOnClick text={`${username}.${id}`}>
                                    <Input type={'text'} value={`${username}.${id}`} readOnly variant={'glass'} />
                                </CopyOnClick>
                            </div>
                            <div css={tw`mt-6 flex items-center`}>
                                <div css={tw`flex-1`}>
                                    <div
                                        css={tw`p-4 rounded-xl`}
                                        style={{
                                            borderLeft: '4px solid #6366f1',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                        }}
                                    >
                                        <p css={tw`text-xs leading-relaxed text-neutral-300`}>
                                            Your SFTP password is the same as the password you use to access this panel.
                                        </p>
                                    </div>
                                </div>
                                <div css={tw`ml-4`}>
                                    <a href={`sftp://${username}.${id}@${ip(sftp.ip)}:${sftp.port}`}>
                                        <Button
                                            style={{
                                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                                border: '1px solid #4338ca',
                                                color: '#ffffff',
                                                fontWeight: 600,
                                                borderRadius: '0.75rem',
                                            }}
                                        >
                                            Launch SFTP
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </TitledGreyBox>
                    </Can>
                    <TitledGreyBox title={'Debug Information'} css={tw`mb-6 md:mb-10`} glass>
                        <div css={tw`flex items-center justify-between text-sm`}>
                            <p css={tw`text-neutral-400 font-medium`}>Node</p>
                            <code
                                css={tw`font-mono rounded-lg py-1 px-3`}
                                style={{
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    color: '#818cf8',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    fontWeight: 600,
                                }}
                            >
                                {node}
                            </code>
                        </div>
                        <CopyOnClick text={uuid}>
                            <div css={tw`flex items-center justify-between mt-4 text-sm`}>
                                <p css={tw`text-neutral-400 font-medium`}>Server ID</p>
                                <code
                                    css={tw`font-mono rounded-lg py-1 px-3`}
                                    style={{
                                        background: 'rgba(168, 85, 247, 0.1)',
                                        color: '#c084fc',
                                        border: '1px solid rgba(168, 85, 247, 0.2)',
                                        fontWeight: 600,
                                    }}
                                >
                                    {uuid}
                                </code>
                            </div>
                        </CopyOnClick>
                    </TitledGreyBox>
                </div>
                <div css={tw`w-full mt-6 md:flex-1 md:mt-0`}>
                    <Can action={'settings.rename'}>
                        <div css={tw`mb-6 md:mb-10`}>
                            <RenameServerBox />
                        </div>
                    </Can>
                    <Can action={'settings.reinstall'}>
                        <ReinstallServerBox />
                    </Can>
                </div>
            </div>
        </ServerContentBlock>
    );
};
