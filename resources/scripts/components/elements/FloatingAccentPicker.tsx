import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ACCENT_PRESETS } from '@/theme';
import tw from 'twin.macro';
import styled from 'styled-components/macro';

const Fab = styled.button`
    ${tw`fixed bottom-5 right-5 z-[1000] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl border-none outline-none`};
    background: var(--accent);
    box-shadow: 0 8px 20px 0 rgba(var(--accent-rgb), 0.4);

    &:hover {
        transform: scale(1.08);
    }

    &:active {
        transform: scale(0.95);
    }

    & svg {
        ${tw`w-5 h-5 text-white`};
    }
`;

const Panel = styled.div`
    ${tw`fixed bottom-20 right-5 z-[1000] w-64 p-4 rounded-2xl border shadow-2xl`};
    background-color: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-xl);
`;

const PanelTitle = styled.p`
    ${tw`mb-3 text-xs font-black uppercase tracking-widest`};
    color: var(--text-secondary);
`;

const SwatchGrid = styled.div`
    ${tw`grid grid-cols-5 gap-2 mb-3`};
`;

const Swatch = styled.button<{ active: boolean; color: string }>`
    ${tw`w-9 h-9 rounded-lg cursor-pointer transition-all duration-200 border-2 outline-none`};
    background-color: ${(props) => props.color};
    border-color: ${(props) => (props.active ? 'var(--text-primary)' : 'transparent')};
    box-shadow: ${(props) => (props.active ? `0 0 0 2px var(--bg-elevated), 0 0 0 3px ${props.color}` : 'none')};

    &:hover {
        transform: scale(1.1);
    }
`;

const CustomRow = styled.div`
    ${tw`flex items-center gap-2`};
`;

const CustomInput = styled.input`
    ${tw`w-8 h-8 rounded-lg border cursor-pointer`};
    background-color: transparent;
    border-color: var(--border-primary);

    &::-webkit-color-swatch-wrapper {
        padding: 2px;
    }

    &::-webkit-color-swatch {
        border: none;
        border-radius: 4px;
    }
`;

const CustomCode = styled.code`
    ${tw`text-xs font-mono`};
    color: var(--text-secondary);
`;

const PaintIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor'>
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42'
        />
    </svg>
);

const FloatingAccentPicker: React.FC = () => {
    const { accent, setAccent } = useTheme();
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <>
            <Fab onClick={() => setOpen((o) => !o)} aria-label={'Change accent color'} title={'Accent color'}>
                <PaintIcon />
            </Fab>
            {open && (
                <Panel ref={panelRef}>
                    <PanelTitle>Accent Color</PanelTitle>
                    <SwatchGrid>
                        {ACCENT_PRESETS.map((preset) => (
                            <Swatch
                                key={preset.name}
                                color={preset.color}
                                active={accent.toLowerCase() === preset.color.toLowerCase()}
                                onClick={() => setAccent(preset.color)}
                                aria-label={preset.name}
                                title={preset.name}
                            />
                        ))}
                    </SwatchGrid>
                    <CustomRow>
                        <CustomInput
                            type={'color'}
                            value={accent}
                            onChange={(e) => setAccent(e.target.value)}
                            aria-label={'Custom accent color'}
                        />
                        <CustomCode>{accent}</CustomCode>
                    </CustomRow>
                </Panel>
            )}
        </>
    );
};

export default FloatingAccentPicker;
