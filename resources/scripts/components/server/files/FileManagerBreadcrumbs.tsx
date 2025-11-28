import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { NavLink, useLocation } from 'react-router-dom';
import { encodePathSegments, hashToPath } from '@/helpers';
import tw from 'twin.macro';

interface Props {
    renderLeft?: JSX.Element;
    withinFileEditor?: boolean;
    isNewFile?: boolean;
}

export default ({ renderLeft, withinFileEditor, isNewFile }: Props) => {
    const [file, setFile] = useState<string | null>(null);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const { hash } = useLocation();

    useEffect(() => {
        const path = hashToPath(hash);

        if (withinFileEditor && !isNewFile) {
            const name = path.split('/').pop() || null;
            setFile(name);
        }
    }, [withinFileEditor, isNewFile, hash]);

    const breadcrumbs = (): { name: string; path?: string }[] =>
        directory
            .split('/')
            .filter((directory) => !!directory)
            .map((directory, index, dirs) => {
                if (!withinFileEditor && index === dirs.length - 1) {
                    return { name: directory };
                }

                return { name: directory, path: `/${dirs.slice(0, index + 1).join('/')}` };
            });

    return (
        <div
            css={tw`flex flex-grow-0 items-center text-sm overflow-x-hidden`}
            style={{ color: 'rgba(0, 0, 0, 0.7)', fontFamily: 'monospace' }}
        >
            {renderLeft || <div css={tw`w-12`} />}/
            <span css={tw`px-1`} style={{ color: '#000000', fontWeight: 600 }}>
                home
            </span>
            /
            <NavLink
                to={`/server/${id}/files`}
                css={tw`px-1 no-underline`}
                style={{ color: '#000000', fontWeight: 600 }}
            >
                container
            </NavLink>
            /
            {breadcrumbs().map((crumb, index) =>
                crumb.path ? (
                    <React.Fragment key={index}>
                        <NavLink
                            to={`/server/${id}/files#${encodePathSegments(crumb.path)}`}
                            css={tw`px-1 no-underline`}
                            style={{ color: '#f58529', fontWeight: 600 }}
                        >
                            {crumb.name}
                        </NavLink>
                        /
                    </React.Fragment>
                ) : (
                    <span key={index} css={tw`px-1`} style={{ color: '#dd2a7b', fontWeight: 700 }}>
                        {crumb.name}
                    </span>
                )
            )}
            {file && (
                <React.Fragment>
                    <span css={tw`px-1`} style={{ color: '#8134af', fontWeight: 700 }}>
                        {file}
                    </span>
                </React.Fragment>
            )}
        </div>
    );
};
