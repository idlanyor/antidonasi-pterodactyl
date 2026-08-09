import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import Spinner from '@/components/elements/Spinner';
import { StoreProduct } from '@/api/store';
import http from '@/api/http';

const Page = styled.div`
    ${tw`min-h-screen font-sans`};
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
`;

const Container = styled.div`
    ${tw`max-w-5xl mx-auto px-6 py-10`};
`;

const Card = styled.div`
    ${tw`rounded-xl p-6 border`};
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
        border-color: var(--accent);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
`;

const Badge = styled.span`
    ${tw`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full`};
    color: var(--text-secondary);
    background-color: var(--bg-hover);
`;

const BuyButton = styled(Link)`
    ${tw`inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-black text-white no-underline transition-all duration-300`};
    background: var(--accent);
    box-shadow: 0 10px 24px 0 rgba(var(--accent-rgb), 0.24);

    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }
`;

const formatPrice = (sen: number): string => 'RM ' + (sen / 100).toFixed(2);

export default () => {
    const { data: products, error } = useSWR<StoreProduct[]>('/api/store/public/products', () =>
        http.get('/api/store/public/products').then(({ data }) => data.data)
    );

    return (
        <Page>
            <Container>
                <div css={tw`mb-8 text-center`}>
                    <h1 css={tw`text-3xl md:text-4xl font-black tracking-tight`} style={{ color: 'var(--text-primary)' }}>
                        Panel Pricing
                    </h1>
                    <p css={tw`text-base mt-2 font-bold`} style={{ color: 'var(--text-secondary)' }}>
                        Premium resources at unbeatable prices.
                    </p>
                </div>

                <Card>
                    {!products && !error ? (
                        <Spinner centered />
                    ) : error ? (
                        <p css={tw`text-center text-sm font-bold py-8`} style={{ color: 'var(--text-secondary)' }}>
                            Gagal memuat paket. Coba lagi nanti.
                        </p>
                    ) : products!.length === 0 ? (
                        <p css={tw`text-center text-sm font-bold py-8`} style={{ color: 'var(--text-secondary)' }}>
                            Belum ada paket tersedia.
                        </p>
                    ) : (
                        <Table>
                            {products!.map((product) => (
                                <Row key={product.id}>
                                    <Badge>{product.cpu}% CPU</Badge>
                                    <span css={tw`text-sm font-bold`} style={{ color: 'var(--text-primary)' }}>
                                        {product.memory} MB RAM · {Math.round(product.disk / 1024)} GB Storage
                                    </span>
                                    <span css={tw`flex items-center gap-3`}>
                                        <span css={tw`text-base font-black`} style={{ color: 'var(--accent)' }}>
                                            {formatPrice(product.price)}
                                        </span>
                                        <BuyButton to={`/checkout/${product.id}`}>Beli</BuyButton>
                                    </span>
                                </Row>
                            ))}
                        </Table>
                    )}
                </Card>

                <div css={tw`mt-6 grid grid-cols-1 md:grid-cols-2 gap-6`}>
                    <Card>
                        <h2 css={tw`text-lg md:text-xl font-black mb-3 tracking-tight`} style={{ color: 'var(--text-primary)' }}>
                            Premium Benefits
                        </h2>
                        <ul css={tw`text-sm font-bold space-y-2.5`} style={{ color: 'var(--text-secondary)' }}>
                            <li className={'flex items-center gap-2'}>
                                <span style={{ color: 'var(--accent)' }}>✔</span> Bisa diperpanjang selamanya
                            </li>
                            <li className={'flex items-center gap-2'}>
                                <span style={{ color: 'var(--accent)' }}>✔</span> Garansi Full 30 Hari
                            </li>
                            <li className={'flex items-center gap-2'}>
                                <span style={{ color: 'var(--accent)' }}>✔</span> Network Speed 1.5-10 GB/s
                            </li>
                            <li className={'flex items-center gap-2'}>
                                <span style={{ color: 'var(--accent)' }}>✔</span> AMD Epyc Milan &amp; Intel High-End
                            </li>
                        </ul>
                    </Card>
                    <Card>
                        <h2 css={tw`text-2xl font-black mb-4 tracking-tight`} style={{ color: 'var(--text-primary)' }}>
                            Usage Terms
                        </h2>
                        <p css={tw`text-base font-bold`} style={{ color: 'var(--text-secondary)' }}>
                            Dilarang keras aktivitas ilegal (DDOS, Mining, Exploit). Pelanggaran berakibat suspend permanen.
                        </p>
                        <div css={tw`mt-6`}>
                            <a
                                href={'https://wa.me/62895395590009'}
                                target={'_blank'}
                                rel={'noreferrer'}
                                css={tw`inline-flex items-center justify-center w-full py-2.5 rounded-xl text-white text-sm font-black transition-all duration-300 shadow-md`}
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent) 100%)',
                                    boxShadow: '0 14px 30px 0 rgba(var(--accent-rgb), 0.24)',
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
};
