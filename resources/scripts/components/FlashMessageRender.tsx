import React from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import toastr from '@/lib/toastr';

type Props = Readonly<{
    byKey?: string;
    className?: string;
}>;

const FlashMessageRender = ({ byKey }: Props) => {
    const flashes = useStoreState((state) =>
        state.flashes.items.filter((flash) => (byKey ? flash.key === byKey : true))
    );
    const remove = useStoreActions((s: any) => s.flashes.removeFlash);

    React.useEffect(() => {
        if (!flashes.length) return;
        flashes.forEach((f) => {
            const title = f.title || (f.type === 'error' ? 'Error' : f.type === 'success' ? 'Success' : 'Info');
            const type = f.type || 'info';
            toastr.options.timeOut = type === 'error' ? 8000 : 5000;
            toastr[type](f.message, title);
            remove(f.id as string);
        });
    }, [flashes.map((f) => f.id).join(',')]);

    return null;
};

export default FlashMessageRender;
