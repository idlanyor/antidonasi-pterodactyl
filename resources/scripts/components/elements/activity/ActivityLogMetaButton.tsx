import React, { useState } from 'react';
import { ClipboardListIcon } from '@heroicons/react/outline';
import { Dialog } from '@/components/elements/dialog';
import Button from '@/components/elements/Button';

export default ({ meta }: { meta: Record<string, unknown> }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={'self-center md:px-4'}>
            <Dialog open={open} onClose={() => setOpen(false)} hideCloseIcon title={'Activity Metadata'}>
                <pre
                    className={
                        'bg-neutral-50 border border-neutral-100 rounded-xl p-6 font-mono text-xs leading-relaxed overflow-x-scroll whitespace-pre-wrap text-brand-navy font-bold'
                    }
                >
                    {JSON.stringify(meta, null, 2)}
                </pre>
                <Dialog.Footer>
                    <Button isSecondary onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Dialog.Footer>
            </Dialog>
            <button
                aria-describedby={'View additional event metadata'}
                className={
                    'p-2 transition-all duration-300 text-brand-slate hover:text-accent-purple hover:bg-neutral-50 rounded-xl'
                }
                onClick={() => setOpen(true)}
            >
                <ClipboardListIcon className={'w-6 h-6'} />
            </button>
        </div>
    );
};
