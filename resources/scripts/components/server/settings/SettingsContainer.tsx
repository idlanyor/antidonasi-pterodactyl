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
                                        css={tw`p-3 rounded`}
                                        style={{
                                            borderLeft: '4px solid #06b6d4',
                                            background: 'rgba(6, 182, 212, 0.1)',
                                        }}
                                    >
                                        <p css={tw`text-xs`} style={{ color: '#000000', lineHeight: '1.4' }}>
                                            Your SFTP password is the same as the password you use to access this panel.
                                        </p>
                                    </div>
                                </div>
                                <div css={tw`ml-4`}>
                                    <a href={`sftp://${username}.${id}@${ip(sftp.ip)}:${sftp.port}`}>
                                        <Button.Text
                                            style={{
                                                background: 'rgba(245, 133, 41, 0.2)',
                                                border: '2px solid rgba(245, 133, 41, 0.5)',
                                                color: '#000000',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Launch SFTP
                                        </Button.Text>
                                    </a>
                                </div>
                            </div>
                        </TitledGreyBox>
                    </Can>
                    <TitledGreyBox title={'Debug Information'} css={tw`mb-6 md:mb-10`} glass>
                        <div css={tw`flex items-center justify-between text-sm`}>
                            <p style={{ color: '#000000', fontWeight: 600 }}>Node</p>
                            <code
                                css={tw`font-mono rounded py-1 px-2`}
                                style={{
                                    background: 'rgba(245, 133, 41, 0.15)',
                                    color: '#000000',
                                    border: '1px solid rgba(245, 133, 41, 0.3)',
                                    fontWeight: 600,
                                }}
                            >
                                {node}
                            </code>
                        </div>
                        <CopyOnClick text={uuid}>
                            <div css={tw`flex items-center justify-between mt-2 text-sm`}>
                                <p style={{ color: '#000000', fontWeight: 600 }}>Server ID</p>
                                <code
                                    css={tw`font-mono rounded py-1 px-2`}
                                    style={{
                                        background: 'rgba(221, 42, 123, 0.15)',
                                        color: '#000000',
                                        border: '1px solid rgba(221, 42, 123, 0.3)',
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
