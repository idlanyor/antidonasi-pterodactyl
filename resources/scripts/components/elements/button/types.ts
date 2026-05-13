import { ButtonHTMLAttributes } from 'react';

export type ButtonSize = 'xsmall' | 'small' | 'large' | 'xlarge';
export type ButtonColor = 'primary' | 'grey' | 'green' | 'red';
export type ButtonVariant = 'default' | 'glass';
export type ButtonShape = 'default' | 'oval';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
    size?: ButtonSize;
    color?: ButtonColor;
    isSecondary?: boolean;
    variant?: ButtonVariant;
    shape?: ButtonShape;
    palette?: 'purpleRed' | 'indigoPink' | 'cyanBlue' | 'sunset' | 'rainbow' | 'instagram';
};

export const Options = {
    Size: {
        Small: 'small' as const,
        Large: 'large' as const,
        Default: 'small' as const,
    },
};
