import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { v4 } from 'uuid';
import tw from 'twin.macro';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';

const ToggleContainer = styled.div`
    ${tw`relative select-none w-12 leading-normal`};

    & > input[type='checkbox'] {
        ${tw`hidden`};

        &:checked + label {
            ${tw`bg-accent-purple border-accent-purple shadow-none`};
            background-color: #7c3aed;
            border-color: #7c3aed;
        }

        &:checked + label:before {
            right: 0.125rem;
        }
    }

    & > label {
        ${tw`mb-0 block overflow-hidden cursor-pointer bg-neutral-200 border border-neutral-300 rounded-full h-6 shadow-inner transition-all duration-300`};
        background-color: #e2e8f0;
        border-color: #cbd5e1;

        &::before {
            ${tw`absolute block bg-white border h-5 w-5 rounded-full shadow-sm`};
            top: 0.125rem;
            right: calc(50% + 0.125rem);
            content: '';
            transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
    }
`;

export interface SwitchProps {
    name: string;
    label?: string;
    description?: string;
    defaultChecked?: boolean;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
}

const Switch = ({ name, label, description, defaultChecked, readOnly, onChange, children }: SwitchProps) => {
    const uuid = useMemo(() => v4(), []);

    return (
        <div css={tw`flex items-center`}>
            <ToggleContainer css={tw`flex-none`}>
                {children || (
                    <Input
                        id={uuid}
                        name={name}
                        type={'checkbox'}
                        onChange={(e) => onChange && onChange(e)}
                        defaultChecked={defaultChecked}
                        disabled={readOnly}
                    />
                )}
                <Label htmlFor={uuid} />
            </ToggleContainer>
            {(label || description) && (
                <div css={tw`ml-4 w-full`}>
                    {label && (
                        <Label
                            css={[tw`cursor-pointer font-black text-brand-navy`, !!description && tw`mb-0`]}
                            htmlFor={uuid}
                        >
                            {label}
                        </Label>
                    )}
                    {description && <p css={tw`text-brand-slate text-sm mt-1 font-bold`}>{description}</p>}
                </div>
            )}
        </div>
    );
};

export default Switch;
