import React from 'react';
import { Field as FormikField, FieldProps } from 'formik';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';

type Props = {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    description?: string;
    disabled?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
};

const Wrapper = styled.div`
    ${tw`relative`};
`;

const Icon = styled.div`
    ${tw`absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300`};
    pointer-events: none;
    & svg {
        ${tw`w-5 h-5`}
    }
`;

const StyledInput = styled(Input)`
    padding-left: 2.5rem; /* leave space for icon */
`;

const AuthField: React.FC<Props> = ({
    name,
    label,
    type = 'text',
    placeholder,
    icon,
    description,
    disabled,
    autoComplete,
    autoFocus,
}) => (
    <FormikField name={name}>
        {({ field, form: { errors, touched } }: FieldProps) => (
            <div>
                {label && (
                    <Label htmlFor={name} className={'auth-label'}>
                        {label}
                    </Label>
                )}
                <Wrapper>
                    {icon && <Icon>{icon}</Icon>}
                    <StyledInput
                        id={name}
                        {...field}
                        type={type}
                        placeholder={placeholder}
                        className={`auth-input ${touched[field.name] && errors[field.name] ? 'auth-error' : ''}`}
                        autoComplete={autoComplete}
                        autoFocus={autoFocus}
                        disabled={disabled}
                    />
                </Wrapper>
                {touched[field.name] && errors[field.name] ? (
                    <p
                        className={'input-help error'}
                        style={{ color: '#ff4d4d', marginTop: '0.5rem', fontSize: '0.75rem' }}
                    >
                        {(errors[field.name] as string).charAt(0).toUpperCase() +
                            (errors[field.name] as string).slice(1)}
                    </p>
                ) : description ? (
                    <p className={'input-help'} style={{ color: '#9ca3af', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                        {description}
                    </p>
                ) : null}
            </div>
        )}
    </FormikField>
);

export default AuthField;
