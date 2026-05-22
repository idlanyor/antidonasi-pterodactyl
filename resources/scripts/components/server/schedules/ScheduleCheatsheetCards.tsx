import React from 'react';
import tw from 'twin.macro';

export default () => {
    return (
        <>
            <div css={tw`md:w-1/2 h-full bg-white border border-neutral-200 rounded-l-xl overflow-hidden`}>
                <div css={tw`flex flex-col`}>
                    <h2
                        css={tw`py-3 px-6 font-black text-neutral-900 bg-neutral-50 border-b border-neutral-200 text-xs uppercase tracking-widest`}
                    >
                        Examples
                    </h2>
                    <div css={tw`flex py-3 px-6 border-b border-neutral-50`}>
                        <div css={tw`w-1/2 font-mono text-xs font-bold text-accent-purple`}>*/5 * * * *</div>
                        <div css={tw`w-1/2 text-xs font-bold text-neutral-500`}>every 5 minutes</div>
                    </div>
                    <div css={tw`flex py-3 px-6 border-b border-neutral-50`}>
                        <div css={tw`w-1/2 font-mono text-xs font-bold text-accent-purple`}>0 */1 * * *</div>
                        <div css={tw`w-1/2 text-xs font-bold text-neutral-500`}>every hour</div>
                    </div>
                    <div css={tw`flex py-3 px-6 border-b border-neutral-50`}>
                        <div css={tw`w-1/2 font-mono text-xs font-bold text-accent-purple`}>0 8-12 * * *</div>
                        <div css={tw`w-1/2 text-xs font-bold text-neutral-500`}>hour range</div>
                    </div>
                    <div css={tw`flex py-3 px-6 border-b border-neutral-50`}>
                        <div css={tw`w-1/2 font-mono text-xs font-bold text-accent-purple`}>0 0 * * *</div>
                        <div css={tw`w-1/2 text-xs font-bold text-neutral-500`}>once a day</div>
                    </div>
                    <div css={tw`flex py-3 px-6`}>
                        <div css={tw`w-1/2 font-mono text-xs font-bold text-accent-purple`}>0 0 * * MON</div>
                        <div css={tw`w-1/2 text-xs font-bold text-neutral-500`}>every Monday</div>
                    </div>
                </div>
            </div>
            <div css={tw`md:w-1/2 h-full bg-white border border-l-0 border-neutral-200 rounded-r-xl overflow-hidden`}>
                <h2
                    css={tw`py-3 px-6 font-black text-neutral-900 bg-neutral-50 border-b border-neutral-200 text-xs uppercase tracking-widest`}
                >
                    Special Characters
                </h2>
                <div css={tw`flex flex-col`}>
                    <div css={tw`flex py-3 px-6 border-b border-neutral-50`}>
                        <div css={tw`w-1/2 font-mono text-xs font-bold text-accent-purple`}>*</div>
                        <div css={tw`w-1/2 text-xs font-bold text-neutral-500`}>any value</div>
                    </div>
                    <div css={tw`flex py-3 px-6 border-b border-neutral-50`}>
                        <div css={tw`w-1/2 font-mono text-xs font-bold text-accent-purple`}>,</div>
                        <div css={tw`w-1/2 text-xs font-bold text-neutral-500`}>value list separator</div>
                    </div>
                    <div css={tw`flex py-3 px-6 border-b border-neutral-50`}>
                        <div css={tw`w-1/2 font-mono text-xs font-bold text-accent-purple`}>-</div>
                        <div css={tw`w-1/2 text-xs font-bold text-neutral-500`}>range values</div>
                    </div>
                    <div css={tw`flex py-3 px-6`}>
                        <div css={tw`w-1/2 font-mono text-xs font-bold text-accent-purple`}>/</div>
                        <div css={tw`w-1/2 text-xs font-bold text-neutral-500`}>step values</div>
                    </div>
                </div>
            </div>
        </>
    );
};
