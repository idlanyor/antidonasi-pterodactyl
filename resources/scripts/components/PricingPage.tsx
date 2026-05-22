import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Page = styled.div`
    ${tw`min-h-screen font-sans`};
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
`;

const Container = styled.div`
    ${tw`max-w-5xl mx-auto px-6 py-16`};
`;

const Card = styled.div`
    ${tw`rounded-xl p-8 border`};
    background-color: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);
    transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const Table = styled.div`
    ${tw`grid grid-cols-1 md:grid-cols-2 gap-6`};
`;

const Row = styled.div`
    ${tw`flex items-center justify-between px-6 py-4 rounded-xl border transition-all duration-300`};
    background-color: var(--bg-tertiary);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-sm);

    &:hover {
        border-color: theme('colors.accent-purple');
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
`;

const Badge = styled.span`
    ${tw`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full`};
    color: var(--text-secondary);
    background-color: var(--bg-hover);
`;

export default () => (
    <Page>
        <Container>
            <div css={tw`mb-12 text-center`}>
                <h1
                    css={tw`text-5xl font-black tracking-tight`}
                    style={{ color: 'var(--text-primary)' }}
                >
                    Panel Pricing
                </h1>
                <p css={tw`text-lg mt-3 font-bold`} style={{ color: 'var(--text-secondary)' }}>
                    Premium resources at unbeatable prices.
                </p>
            </div>

            <Card>
                <Table>
                    <Row>
                        <Badge>100% CPU</Badge>
                        <span css={tw`text-sm font-bold`} style={{ color: 'var(--text-primary)' }}>2 GB RAM · 3 GB Storage</span>
                        <span css={tw`text-base font-black text-accent-purple`}>10.000</span>
                    </Row>
                    <Row>
                        <Badge>200% CPU</Badge>
                        <span css={tw`text-sm font-bold`} style={{ color: 'var(--text-primary)' }}>4 GB RAM · 5 GB Storage</span>
                        <span css={tw`text-base font-black text-accent-purple`}>15.000</span>
                    </Row>
                    <Row>
                        <Badge>300% CPU</Badge>
                        <span css={tw`text-sm font-bold`} style={{ color: 'var(--text-primary)' }}>6 GB RAM · 7 GB Storage</span>
                        <span css={tw`text-base font-black text-accent-purple`}>20.000</span>
                    </Row>
                    <Row>
                        <Badge>400% CPU</Badge>
                        <span css={tw`text-sm font-bold`} style={{ color: 'var(--text-primary)' }}>8 GB RAM · 10 GB Storage</span>
                        <span css={tw`text-base font-black text-accent-purple`}>25.000</span>
                    </Row>
                    <Row>
                        <Badge>500% CPU</Badge>
                        <span css={tw`text-sm font-bold`} style={{ color: 'var(--text-primary)' }}>12 GB RAM · 12 GB Storage</span>
                        <span css={tw`text-base font-black text-accent-purple`}>30.000</span>
                    </Row>
                    <Row>
                        <Badge>600% CPU</Badge>
                        <span css={tw`text-sm font-bold`} style={{ color: 'var(--text-primary)' }}>13 GB RAM · 20 GB Storage</span>
                        <span css={tw`text-base font-black text-accent-purple`}>35.000</span>
                    </Row>
                    <Row>
                        <Badge>700% CPU</Badge>
                        <span css={tw`text-sm font-bold`} style={{ color: 'var(--text-primary)' }}>15 GB RAM · 25 GB Storage</span>
                        <span css={tw`text-base font-black text-accent-purple`}>50.000</span>
                    </Row>
                </Table>
            </Card>

            <div css={tw`mt-8 grid grid-cols-1 md:grid-cols-2 gap-8`}>
                <Card>
                    <h2
                        css={tw`text-2xl font-black mb-4 tracking-tight`}
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Premium Benefits
                    </h2>
                    <ul css={tw`text-base font-bold space-y-3`} style={{ color: 'var(--text-secondary)' }}>
                        <li className={'flex items-center gap-2'}>
                            <span className={'text-accent-purple'}>✔</span> Bisa diperpanjang selamanya
                        </li>
                        <li className={'flex items-center gap-2'}>
                            <span className={'text-accent-purple'}>✔</span> Garansi Full 30 Hari
                        </li>
                        <li className={'flex items-center gap-2'}>
                            <span className={'text-accent-purple'}>✔</span> Network Speed 1.5-10 GB/s
                        </li>
                        <li className={'flex items-center gap-2'}>
                            <span className={'text-accent-purple'}>✔</span> AMD Epyc Milan &amp; Intel High-End
                        </li>
                    </ul>
                </Card>
                <Card>
                    <h2
                        css={tw`text-2xl font-black mb-4 tracking-tight`}
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Usage Terms
                    </h2>
                    <p css={tw`text-base font-bold`} style={{ color: 'var(--text-secondary)' }}>
                        Dilarang keras aktivitas ilegal (DDOS, Mining, Exploit). Pelanggaran berakibat suspend permanen.
                    </p>
                    <div css={tw`mt-8`}>
                        <a
                            href={'https://wa.me/62895395590009'}
                            target={'_blank'}
                            rel={'noreferrer'}
                            css={tw`inline-flex items-center justify-center w-full py-4 rounded-xl text-white text-base font-black transition-all duration-300 shadow-md`}
                            style={{
                                background: 'linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)',
                                boxShadow: '0 14px 30px 0 rgba(168, 85, 247, 0.24)',
                            }}
                        >
                            Hubungi Admin Sekarang
                        </a>
                    </div>
                </Card>
            </div>
        </Container>
    </Page>
);
