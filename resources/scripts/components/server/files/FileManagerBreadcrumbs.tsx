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
            style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {renderLeft || <div css={tw`w-12`} />}/
            <span css={tw`px-1`} style={{ color: '#ffffff', fontWeight: 600 }}>
                home
            </span>
            /
            <NavLink
                to={`/server/${id}/files`}
                css={tw`px-1 no-underline transition-colors duration-200 hover:text-indigo-400`}
                style={{ color: '#ffffff', fontWeight: 600 }}
            >
                container
            </NavLink>
            /
            {breadcrumbs().map((crumb, index) =>
                crumb.path ? (
                    <React.Fragment key={index}>
                        <NavLink
                            to={`/server/${id}/files#${encodePathSegments(crumb.path)}`}
                            css={tw`px-1 no-underline transition-colors duration-200 hover:text-indigo-300`}
                            style={{ color: '#818cf8', fontWeight: 600 }}
                        >
                            {crumb.name}
                        </NavLink>
                        /
                    </React.Fragment>
                ) : (
                    <span key={index} css={tw`px-1`} style={{ color: '#c084fc', fontWeight: 700 }}>
                        {crumb.name}
                    </span>
                )
            )}
            {file && (
                <React.Fragment>
                    <span css={tw`px-1`} style={{ color: '#ffffff', fontWeight: 700 }}>
                        {file}
                    </span>
                </React.Fragment>
            )}
        </div>
    );
};
