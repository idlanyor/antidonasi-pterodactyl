enum Shape {
    Default,
    IconSquare,
    Oval,
}

enum Size {
    Default,
    Small,
    Large,
}

enum Variant {
    Primary,
    Secondary,
}

export const Options = { Shape, Size, Variant };

export type ButtonProps = JSX.IntrinsicElements['button'] & {
    shape?: Shape;
    size?: Size;
    variant?: Variant;
    palette?: 'purpleRed' | 'indigoPink' | 'cyanBlue' | 'sunset' | 'rainbow';
    appearance?: 'default' | 'glass';
};
