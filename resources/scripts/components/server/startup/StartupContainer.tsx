import React, { useCallback, useEffect, useState } from 'react';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import tw from 'twin.macro';
import VariableBox from '@/components/server/startup/VariableBox';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import getServerStartup from '@/api/swr/getServerStartup';
import Spinner from '@/components/elements/Spinner';
import { ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import { useDeepCompareEffect } from '@/plugins/useDeepCompareEffect';
import Select from '@/components/elements/Select';
import isEqual from 'react-fast-compare';
import Input from '@/components/elements/Input';
import setSelectedDockerImage from '@/api/server/setSelectedDockerImage';
import InputSpinner from '@/components/elements/InputSpinner';
import useFlash from '@/plugins/useFlash';
import Fade from '@/components/elements/Fade';

const StartupContainer = () => {
    const [loading, setLoading] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const variables = ServerContext.useStoreState(
        ({ server }) => ({
            variables: server.data!.variables,
            invocation: server.data!.invocation,
            dockerImage: server.data!.dockerImage,
        }),
        isEqual
    );

    const { data, error, isValidating, mutate } = getServerStartup(uuid, {
        ...variables,
        dockerImages: { [variables.dockerImage]: variables.dockerImage },
    });

    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);
    const isCustomImage =
        data &&
        !Object.values(data.dockerImages)
            .map((v) => v.toLowerCase())
            .includes(variables.dockerImage.toLowerCase());

    useEffect(() => {
        // Since we're passing in initial data this will not trigger on mount automatically. We
        // want to always fetch fresh information from the API however when we're loading the startup
        // information.
        mutate();
    }, []);

    useDeepCompareEffect(() => {
        if (!data) return;

        setServerFromState((s) => ({
            ...s,
            invocation: data.invocation,
            variables: data.variables,
        }));
    }, [data]);

    const updateSelectedDockerImage = useCallback(
        (v: React.ChangeEvent<HTMLSelectElement>) => {
            setLoading(true);
            clearFlashes('startup:image');

            const image = v.currentTarget.value;
            setSelectedDockerImage(uuid, image)
                .then(() => setServerFromState((s) => ({ ...s, dockerImage: image })))
                .catch((error) => {
                    console.error(error);
                    clearAndAddHttpError({ key: 'startup:image', error });
                })
                .then(() => setLoading(false));
        },
        [uuid]
    );

    return !data ? (
        !error || (error && isValidating) ? (
            <Spinner centered size={Spinner.Size.LARGE} />
        ) : (
            <ServerError title={'Oops!'} message={httpErrorToHuman(error)} onRetry={() => mutate()} />
        )
    ) : (
        <ServerContentBlock title={'Startup Settings'} showFlashKey={'startup:image'}>
            <Fade in appear timeout={200}>
                <div css={tw`md:flex md:items-stretch md:space-x-8`}>
                    <TitledGreyBox title={'Startup Command'} css={tw`flex-1`}>
                        <div css={tw`px-1 py-2`}>
                            <p
                                css={tw`font-mono rounded-xl py-4 px-6 break-words whitespace-normal text-sm font-bold`}
                                style={{
                                    background: '#F8FAFC',
                                    color: '#0F172A',
                                    border: '1px solid #E2E8F0',
                                }}
                                title={data.invocation}
                            >
                                {data.invocation}
                            </p>
                        </div>
                    </TitledGreyBox>
                    <TitledGreyBox title={'Docker Image'} css={tw`flex-1 lg:flex-none lg:w-1/3 mt-8 md:mt-0`}>
                        {Object.keys(data.dockerImages).length > 1 && !isCustomImage ? (
                            <>
                                <InputSpinner visible={loading}>
                                    <Select
                                        disabled={Object.keys(data.dockerImages).length < 2}
                                        onChange={updateSelectedDockerImage}
                                        defaultValue={variables.dockerImage}
                                    >
                                        {Object.keys(data.dockerImages).map((key) => (
                                            <option key={data.dockerImages[key]} value={data.dockerImages[key]}>
                                                {key}
                                            </option>
                                        ))}
                                    </Select>
                                </InputSpinner>
                                <p css={tw`text-xs mt-3 text-brand-slate font-bold leading-relaxed`}>
                                    This is an advanced feature allowing you to select a Docker image to use when
                                    running this server instance.
                                </p>
                            </>
                        ) : (
                            <>
                                <Input disabled readOnly value={variables.dockerImage} />
                                {isCustomImage && (
                                    <p css={tw`text-xs mt-3 text-brand-slate font-bold leading-relaxed`}>
                                        This {"server's"} Docker image has been manually set by an administrator and
                                        cannot be changed through this UI.
                                    </p>
                                )}
                            </>
                        )}
                    </TitledGreyBox>
                </div>
            </Fade>
            <h3 css={tw`mt-12 mb-6 text-3xl font-black text-brand-navy tracking-tight`}>Variables</h3>
            <div css={tw`grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`}>
                {data.variables.map((variable, i) => (
                    <Fade key={variable.envVariable} in appear timeout={180}>
                        <div style={{ transitionDelay: `${i * 40}ms` }}>
                            <VariableBox variable={variable} />
                        </div>
                    </Fade>
                ))}
            </div>
        </ServerContentBlock>
    );
};

export default StartupContainer;
