import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    body {
        ${tw`font-sans text-brand-navy bg-neutral-50`};
        font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0.015em;
        min-height: 100vh;
        background-color: #F8FAFC;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-bold tracking-tight font-header text-brand-navy`};
        font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    p {
        ${tw`text-brand-slate leading-relaxed font-sans font-bold`};
        font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: none;
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-thumb {
        ${tw`bg-neutral-700 rounded-full`};
        border: 2px solid transparent;
        background-clip: content-box;
    }

    ::-webkit-scrollbar-thumb:hover {
        ${tw`bg-neutral-600`};
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
