import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import PageContentBlock from '@/components/elements/PageContentBlock';
import Spinner from '@/components/elements/Spinner';
import useSWR from 'swr';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import { getStoreOrders, retryStoreOrder, StoreOrder } from '@/api/store';
import useFlash from '@/plugins/useFlash';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const formatPrice = (sen: number): string => 'RM ' + (sen / 100).toFixed(2);

const statusLabel: Record<StoreOrder['status'], string> = {
    pending: 'Menunggu',
    paid: 'Dibayar',
    failed: 'Gagal',
    cancelled: 'Dibatalkan',
};

const statusColor: Record<StoreOrder['status'], string> = {
    pending: 'var(--status-warning-text)',
    paid: 'var(--status-success-text)',
    failed: 'var(--status-error-text)',
    cancelled: 'var(--text-muted)',
};

const statusBg: Record<StoreOrder['status'], string> = {
    pending: 'var(--status-warning-bg)',
    paid: 'var(--status-success-bg)',
    failed: 'var(--status-error-bg)',
    cancelled: 'var(--bg-tertiary)',
};

const statusBorder: Record<StoreOrder['status'], string> = {
    pending: 'var(--status-warning-border)',
    paid: 'var(--status-success-border)',
    failed: 'var(--status-error-border)',
    cancelled: 'var(--border-primary)',
};

const Title = styled.div`
    ${tw`relative mb-6 p-6 md:p-8 rounded-2xl overflow-hidden`};
    background: var(--gradient-hero);
    border: 1px solid var(--gradient-hero-border);
    box-shadow: var(--shadow-lg);

    h1 {
        ${tw`text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight`};
        color: var(--text-primary);
        font-family: 'Raleway', sans-serif;
    }

    p {
        ${tw`mt-2 text-sm md:text-base font-bold leading-relaxed`};
        color: var(--text-secondary);
    }
`;

const Row = styled.div`
    ${tw`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 rounded-xl border mb-3`};
    background: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);
    transition: all 0.3s ease-in-out;

    &:hover {
        border-color: var(--border-secondary);
        box-shadow: var(--shadow-lg-hover);
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
    const { data: orders, error, mutate } = useSWR<StoreOrder[]>('/api/client/store/orders', () => getStoreOrders(), {
        revalidateOnFocus: true,
        refreshInterval: 15000,
    });
    const { addFlash, clearFlashes } = useFlash();
    const [retryingId, setRetryingId] = React.useState<number | null>(null);

    useEffect(() => {
        if (error) {
            addFlash({ type: 'error', title: 'Error', message: 'Gagal memuat riwayat order.' });
        }
    }, [error]);

    const retry = (order: StoreOrder) => {
        clearFlashes('store');
        setRetryingId(order.id);
        retryStoreOrder(order.id)
            .then((result) => {
                window.location.href = result.payment_url;
            })
            .catch((err) => {
                addFlash({ type: 'error', title: 'Error', message: 'Gagal memulai pembayaran: ' + (err.response?.data?.error || err.message) });
                setRetryingId(null);
            });
    };

    return (
        <PageContentBlock title={'Riwayat Order'} showFlashKey={'store'}>
            <Title>
                <h1>Riwayat Order</h1>
                <p>Status pembayaran & server yang dibuat dari pesananmu.</p>
            </Title>

            {!orders && !error ? (
                <Spinner centered />
            ) : error ? (
                <EmptyState>
                    <FontAwesomeIcon icon={faReceipt} size={'3x'} style={{ color: 'var(--text-muted)' }} />
                    <h2>Gagal memuat order</h2>
                    <p>Coba muat ulang halaman ini.</p>
                </EmptyState>
            ) : orders!.length === 0 ? (
                <EmptyState>
                    <FontAwesomeIcon icon={faReceipt} size={'3x'} style={{ color: 'var(--text-muted)' }} />
                    <h2>Belum ada order</h2>
                    <p>Kamu belum pernah membeli paket apa pun.</p>
                </EmptyState>
            ) : (
                <div>
                    {orders!.map((order) => (
                        <Row key={order.id}>
                            <div css={tw`flex items-center gap-3 min-w-0 flex-1`}>
                                <div
                                    css={tw`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}
                                    style={{
                                        backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                                        border: '1px solid rgba(var(--accent-rgb), 0.2)',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faReceipt} css={tw`text-base`} style={{ color: 'var(--accent)' }} />
                                </div>
                                <div css={tw`min-w-0`}>
                                    <p css={tw`text-sm font-black tracking-tight truncate`} style={{ color: 'var(--text-primary)' }}>
                                        {order.product || 'Produk dihapus'}
                                    </p>
                                    <p css={tw`text-[10px] font-bold uppercase tracking-widest`} style={{ color: 'var(--text-muted)' }}>
                                        {order.order_number}
                                        {order.created_at ? ' · ' + format(new Date(order.created_at), 'dd MMM yyyy') : ''}
                                    </p>
                                </div>
                            </div>

                            <div css={tw`flex items-center gap-3 sm:gap-4`}>
                                <span
                                    css={tw`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-2`}
                                    style={{ backgroundColor: statusBg[order.status], color: statusColor[order.status], border: `1px solid ${statusBorder[order.status]}` }}
                                >
                                    {statusLabel[order.status]}
                                </span>
                                <span css={tw`text-sm font-black whitespace-nowrap`} style={{ color: 'var(--text-primary)' }}>
                                    {formatPrice(order.amount)}
                                </span>
                                {(order.status === 'pending' || order.status === 'failed') && (
                                    <button
                                        css={tw`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black border-none cursor-pointer`}
                                        style={{ color: 'var(--accent)', backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
                                        disabled={retryingId !== null}
                                        onClick={() => retry(order)}
                                    >
                                        {retryingId === order.id ? <Spinner size={'small'} /> : (
                                            <>
                                                <FontAwesomeIcon icon={faReceipt} size={'sm'} />
                                                Bayar
                                            </>
                                        )}
                                    </button>
                                )}
                                {order.server_id && (
                                    <Link
                                        to={`/server/${order.server_id}`}
                                        css={tw`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black`}
                                        style={{ color: 'var(--accent)', backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
                                    >
                                        <FontAwesomeIcon icon={faBoxOpen} size={'sm'} />
                                        Server
                                    </Link>
                                )}
                            </div>
                        </Row>
                    ))}
                </div>
            )}
        </PageContentBlock>
    );
};
