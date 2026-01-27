import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';
// @ts-expect-error untyped font file
import font from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2';

export default createGlobalStyle`
    @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-display: swap;
        font-weight: 100 700;
        src: url(${font}) format('woff2-variations');
        unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
    }

    body {
<<<<<<< HEAD
        ${tw`font-sans bg-neutral-800 text-neutral-200`};
        letter-spacing: 0.015em;
<<<<<<< HEAD
=======
        background: linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%);
        background-attachment: fixed;
        min-height: 100vh;
>>>>>>> f74ae431a (ganti tema)
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
    }

    p {
        ${tw`text-neutral-200 leading-snug font-sans`};
=======
        ${tw`font-sans text-neutral-300 bg-neutral-900`};
        font-family: 'Inter', 'Quicksand', 'IBM Plex Sans', 'Roboto', system-ui, sans-serif;
        letter-spacing: 0.015em;
        min-height: 100vh;
        background-color: #171717; /* Neutral 900 */
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header text-neutral-100`};
        font-family: 'Inter', 'Quicksand', 'IBM Plex Sans', 'Roboto', system-ui, sans-serif;
    }

    p {
        ${tw`text-neutral-400 leading-relaxed font-sans`};
        font-family: 'Inter', 'Quicksand', 'IBM Plex Sans', 'Roboto', system-ui, sans-serif;
>>>>>>> 957b2587f (theme baru ygy)
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
