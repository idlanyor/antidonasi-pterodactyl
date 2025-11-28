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
                <div css={tw`md:flex md:items-stretch md:space-x-10`}>
                    <TitledGreyBox
                        title={'Startup Command'}
                        css={tw`flex-1`}
                        className={
                            'transition-transform transform-gpu duration-200 hover:-translate-y-0.5 hover:shadow-lg'
                        }
                        glass
                    >
                        <div css={tw`px-1 py-2`}>
                            <p
                                css={tw`font-mono rounded py-2 px-4 break-words whitespace-normal`}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.05)',
                                    color: '#000000',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                }}
                                title={data.invocation}
                            >
                                {data.invocation}
                            </p>
                        </div>
                    </TitledGreyBox>
                    <TitledGreyBox
                        title={'Docker Image'}
                        css={tw`flex-1 lg:flex-none lg:w-1/3 mt-8 md:mt-0`}
                        className={
                            'transition-transform transform-gpu duration-200 hover:-translate-y-0.5 hover:shadow-lg'
                        }
                        glass
                    >
                        {Object.keys(data.dockerImages).length > 1 && !isCustomImage ? (
                            <>
                                <InputSpinner visible={loading}>
                                    <Select
                                        variant='glass'
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
                                <p css={tw`text-xs mt-2`} style={{ color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.4' }}>
                                    This is an advanced feature allowing you to select a Docker image to use when
                                    running this server instance.
                                </p>
                            </>
                        ) : (
                            <>
                                <Input variant='glass' disabled readOnly value={variables.dockerImage} />
                                {isCustomImage && (
                                    <p
                                        css={tw`text-xs mt-2`}
                                        style={{ color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.4' }}
                                    >
                                        This {"server's"} Docker image has been manually set by an administrator and
                                        cannot be changed through this UI.
                                    </p>
                                )}
                            </>
                        )}
                    </TitledGreyBox>
                </div>
            </Fade>
            <h3 css={tw`mt-8 mb-2 text-2xl`} style={{ color: '#000000', fontWeight: 700 }}>
                Variables
            </h3>
            <div css={tw`grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`}>
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
