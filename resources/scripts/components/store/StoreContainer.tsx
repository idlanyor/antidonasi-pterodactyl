import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMemory, faMicrochip, faHdd, faDatabase, faCopy, faArchive, faShoppingCart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PageContentBlock from '@/components/elements/PageContentBlock';
import Spinner from '@/components/elements/Spinner';
import Button from '@/components/elements/Button';
import useSWR from 'swr';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import { getStoreProducts, checkoutStoreProduct, StoreProduct } from '@/api/store';
import { useStoreState } from 'easy-peasy';
import useFlash from '@/plugins/useFlash';
import { useEffect } from 'react';

const formatPrice = (sen: number): string => 'RM ' + (sen / 100).toFixed(2);

const Hero = styled.div`
    ${tw`relative mb-6 p-6 md:p-8 rounded-2xl overflow-hidden`};
    background: var(--gradient-hero);
    border: 1px solid var(--gradient-hero-border);
    box-shadow: var(--shadow-lg);

    h1 {
        ${tw`text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight max-w-2xl`};
        color: var(--text-primary);
        font-family: 'Raleway', sans-serif;
    }

    p {
        ${tw`mt-2 text-sm md:text-base font-bold leading-relaxed max-w-xl`};
        color: var(--text-secondary);
    }
`;

const Grid = styled.div`
    ${tw`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`};
`;

const ProductCard = styled.div`
    ${tw`p-5 rounded-2xl border flex flex-col`};
    background: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);
    transition: all 0.3s ease-in-out;

    &:hover {
        border-color: var(--border-secondary);
        box-shadow: var(--shadow-lg-hover);
        transform: translateY(-2px);
    }
`;

const Price = styled.div`
    ${tw`text-2xl font-black tracking-tight`};
    color: var(--accent);
    font-family: 'Raleway', sans-serif;
`;

const SpecGrid = styled.div`
    ${tw`grid grid-cols-2 gap-2 mt-4`};
`;

const SpecItem = styled.div`
    ${tw`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold`};
    background-color: var(--info-card-bg);
    border: 1px solid var(--info-card-border);
    color: var(--text-secondary);

    svg {
        color: var(--accent);
        flex-shrink: 0;
    }
`;

const EmptyState = styled.div`
    ${tw`flex flex-col items-center justify-center py-20 px-6 rounded-2xl border`};
    background: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);

    h2 {
        ${tw`mt-4 text-xl font-bold`};
        color: var(--text-primary);
    }

    p {
        ${tw`mt-1 text-sm font-medium`};
        color: var(--text-secondary);
    }
`;

export default () => {
    const { data: products, error } = useSWR<StoreProduct[]>('/api/client/store/products', () => getStoreProducts(), {
        revalidateOnFocus: false,
    });
    const { addFlash, clearFlashes } = useFlash();
    const user = useStoreState((state) => state.user.data);
    const [loadingId, setLoadingId] = React.useState<number | null>(null);

    useEffect(() => {
        if (!error) return;
        addFlash({ type: 'error', title: 'Error', message: 'Gagal memuat produk store.' });
    }, [error]);

    const buy = (product: StoreProduct) => {
        if (!user) {
            addFlash({ type: 'error', title: 'Error', message: 'Silakan login terlebih dahulu.' });
            return;
        }

        clearFlashes('store');
        setLoadingId(product.id);
        checkoutStoreProduct(product.id)
            .then((result) => {
                window.location.href = result.payment_url;
            })
            .catch((err) => {
                addFlash({ type: 'error', title: 'Error', message: 'Gagal memulai pembayaran: ' + (err.response?.data?.error || err.message) });
                setLoadingId(null);
            });
    };

    return (
        <PageContentBlock title={'Store'} showFlashKey={'store'}>
            <Hero>
                <h1>Game Server Store</h1>
                <p>Pilih paket server, bayar via Bayarcash, server langsung dibuat otomatis.</p>
            </Hero>

            {!products && !error ? (
                <Spinner centered />
            ) : error ? (
                <EmptyState>
                    <FontAwesomeIcon icon={faShoppingCart} size={'3x'} style={{ color: 'var(--text-muted)' }} />
                    <h2>Gagal memuat store</h2>
                    <p>Coba muat ulang halaman ini.</p>
                </EmptyState>
            ) : products!.length === 0 ? (
                <EmptyState>
                    <FontAwesomeIcon icon={faShoppingCart} size={'3x'} style={{ color: 'var(--text-muted)' }} />
                    <h2>Belum ada produk</h2>
                    <p>Admin belum menambahkan paket apa pun.</p>
                </EmptyState>
            ) : (
                <Grid>
                    {products!.map((product) => (
                        <ProductCard key={product.id}>
                            <div css={tw`flex items-start justify-between gap-3`}>
                                <div css={tw`min-w-0`}>
                                    <h2 css={tw`text-lg font-black tracking-tight truncate`} style={{ color: 'var(--text-primary)' }}>
                                        {product.name}
                                    </h2>
                                    {product.node && (
                                        <p css={tw`mt-0.5 text-[10px] font-black uppercase tracking-widest`} style={{ color: 'var(--text-muted)' }}>
                                            {product.node} · {product.egg || 'Custom'}
                                        </p>
                                    )}
                                </div>
                                <Price>{formatPrice(product.price)}</Price>
                            </div>

                            {product.description && (
                                <p css={tw`mt-3 text-xs font-medium leading-relaxed`} style={{ color: 'var(--text-secondary)' }}>
                                    {product.description}
                                </p>
                            )}

                            <SpecGrid>
                                <SpecItem>
                                    <FontAwesomeIcon icon={faMemory} size={'sm'} />
                                    {product.memory} MB RAM
                                </SpecItem>
                                <SpecItem>
                                    <FontAwesomeIcon icon={faMicrochip} size={'sm'} />
                                    {product.cpu}% CPU
                                </SpecItem>
                                <SpecItem>
                                    <FontAwesomeIcon icon={faHdd} size={'sm'} />
                                    {product.disk} MB Disk
                                </SpecItem>
                                <SpecItem>
                                    <FontAwesomeIcon icon={faArchive} size={'sm'} />
                                    {product.backup_limit} Backups
                                </SpecItem>
                                <SpecItem>
                                    <FontAwesomeIcon icon={faDatabase} size={'sm'} />
                                    {product.database_limit} Databases
                                </SpecItem>
                                <SpecItem>
                                    <FontAwesomeIcon icon={faCopy} size={'sm'} />
                                    {product.allocation_limit} Allocations
                                </SpecItem>
                            </SpecGrid>

                            <Button
                                css={tw`mt-5 w-full`}
                                size={'large'}
                                disabled={loadingId !== null}
                                onClick={() => buy(product)}
                            >
                                {loadingId === product.id ? (
                                    <Spinner size={'small'} />
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faShoppingCart} size={'sm'} css={tw`mr-2`} />
                                        Beli Sekarang
                                        <FontAwesomeIcon icon={faArrowRight} size={'sm'} css={tw`ml-2`} />
                                    </>
                                )}
                            </Button>
                        </ProductCard>
                    ))}
                </Grid>
            )}
        </PageContentBlock>
    );
};
