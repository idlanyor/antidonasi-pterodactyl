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
                    className={'rounded-xl p-6 font-mono text-xs leading-relaxed overflow-x-scroll whitespace-pre-wrap font-bold border'}
                    style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                    }}
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
                className={'p-2 transition-all duration-300 hover:text-accent-purple rounded-xl'}
                style={{ color: 'var(--text-secondary)' }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-hover)'; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
                onClick={() => setOpen(true)}
            >
                <ClipboardListIcon className={'w-6 h-6'} />
            </button>
        </div>
    );
};
