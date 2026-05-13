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
import Button from '@/components/elements/Button';

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
                        <TitledGreyBox title={'SFTP Details'} css={tw`mb-8 md:mb-12`}>
                            <div>
                                <Label>Server Address</Label>
                                <CopyOnClick text={`sftp://${ip(sftp.ip)}:${sftp.port}`}>
                                    <Input type={'text'} value={`sftp://${ip(sftp.ip)}:${sftp.port}`} readOnly />
                                </CopyOnClick>
                            </div>
                            <div css={tw`mt-8`}>
                                <Label>Username</Label>
                                <CopyOnClick text={`${username}.${id}`}>
                                    <Input type={'text'} value={`${username}.${id}`} readOnly />
                                </CopyOnClick>
                            </div>
                            <div css={tw`mt-10 flex flex-col md:flex-row items-center gap-6`}>
                                <div css={tw`flex-1 w-full`}>
                                    <div
                                        css={tw`p-4 rounded-xl border border-accent-purple border-opacity-20`}
                                        style={{
                                            background: 'rgba(124, 58, 237, 0.05)',
                                        }}
                                    >
                                        <p css={tw`text-xs leading-relaxed text-brand-slate font-bold`}>
                                            Your SFTP password is the same as the password you use to access this panel.
                                        </p>
                                    </div>
                                </div>
                                <div css={tw`w-full md:w-auto`}>
                                    <a
                                        href={`sftp://${username}.${id}@${ip(sftp.ip)}:${sftp.port}`}
                                        className={'w-full'}
                                    >
                                        <Button size={'large'} css={tw`w-full`}>
                                            Launch SFTP
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </TitledGreyBox>
                    </Can>
                    <TitledGreyBox title={'Debug Information'} css={tw`mb-8 md:mb-12`}>
                        <div css={tw`flex items-center justify-between text-sm`}>
                            <p css={tw`text-brand-slate font-black uppercase tracking-widest text-[10px]`}>Node</p>
                            <code
                                css={tw`font-mono rounded-xl py-1.5 px-4 font-black text-xs`}
                                style={{
                                    background: 'rgba(124, 58, 237, 0.1)',
                                    color: '#7C3AED',
                                    border: '1px solid rgba(124, 58, 237, 0.2)',
                                }}
                            >
                                {node}
                            </code>
                        </div>
                        <CopyOnClick text={uuid}>
                            <div css={tw`flex items-center justify-between mt-6 text-sm`}>
                                <p css={tw`text-brand-slate font-black uppercase tracking-widest text-[10px]`}>
                                    Server ID
                                </p>
                                <code
                                    css={tw`font-mono rounded-xl py-1.5 px-4 font-black text-xs`}
                                    style={{
                                        background: 'rgba(236, 72, 153, 0.1)',
                                        color: '#EC4899',
                                        border: '1px solid rgba(236, 72, 153, 0.2)',
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
