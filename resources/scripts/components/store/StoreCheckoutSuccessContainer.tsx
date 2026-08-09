import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleNotch, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { getStoreOrderStatus, StoreOrderStatus } from '@/api/store';

const formatPrice = (sen: number): string => 'RM ' + (sen / 100).toFixed(2);

const Page = styled.div`
    ${tw`min-h-screen font-sans`};
    background-color: var(--bg-primary);
    color: var(--text-primary);
`;

const Card = styled.div`
    ${tw`max-w-lg mx-auto px-6 py-24`};

    & > div {
        ${tw`p-8 rounded-2xl border text-center`};
        background: var(--bg-elevated);
        border-color: var(--border-primary);
        box-shadow: var(--shadow-lg);
    }
`;

export default () => {
    const { id } = useParams<{ id: string }>();
    const orderId = Number(id);
    const [order, setOrder] = useState<StoreOrderStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            getStoreOrderStatus(orderId)
                .then((data) => {
                    setOrder(data);
                    if (data.status === 'paid' || data.status === 'cancelled' || data.status === 'failed') {
                        clearInterval(timer);
                    }
                })
                .catch(() => setError('Gagal memuat status pembayaran.'));
        }, 4000);

        return () => clearInterval(timer);
    }, [orderId]);

    const pending = !order || order.status === 'pending';

    return (
        <Page>
            <Card>
                <div>
                    {error ? (
                        <>
                            <FontAwesomeIcon icon={faCircleNotch} size={'3x'} spin style={{ color: 'var(--status-error-text)' }} />
                            <h1 css={tw`mt-4 text-xl font-black`} style={{ color: 'var(--text-primary)' }}>
                                Terjadi kesalahan
                            </h1>
                            <p css={tw`mt-2 text-sm font-bold`} style={{ color: 'var(--text-secondary)' }}>
                                {error}
                            </p>
                        </>
                    ) : pending ? (
                        <>
                            <FontAwesomeIcon icon={faCircleNotch} size={'3x'} spin style={{ color: 'var(--accent)' }} />
                            <h1 css={tw`mt-4 text-xl font-black`} style={{ color: 'var(--text-primary)' }}>
                                Menunggu konfirmasi pembayaran
                            </h1>
                            <p css={tw`mt-2 text-sm font-bold`} style={{ color: 'var(--text-secondary)' }}>
                                Server akan dibuat otomatis begitu pembayaran kamu terverifikasi. Halaman ini diperbarui otomatis.
                            </p>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={order.status === 'paid' ? faCheckCircle : faReceipt}
                                size={'3x'}
                                style={{ color: order.status === 'paid' ? 'var(--status-success-text)' : 'var(--status-error-text)' }}
                            />
                            <h1 css={tw`mt-4 text-xl font-black`} style={{ color: 'var(--text-primary)' }}>
                                {order.status === 'paid' ? 'Pembayaran Berhasil!' : 'Pembayaran Belum Selesai'}
                            </h1>
                            <p css={tw`mt-2 text-sm font-bold`} style={{ color: 'var(--text-secondary)' }}>
                                {order.product}
                            </p>
                            <p css={tw`mt-1 text-sm font-black`} style={{ color: 'var(--accent)' }}>
                                {formatPrice(order.amount)}
                            </p>
                            <p css={tw`mt-1 text-xs font-bold`} style={{ color: 'var(--text-muted)' }}>
                                No. Order: {order.order_number}
                            </p>
                            {order.status === 'paid' && (
                                <div css={tw`mt-6 flex flex-col sm:flex-row gap-3 justify-center`}>
                                    <Link to={'/auth/login'} css={tw`no-underline`}>
                                        <span css={tw`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-white text-sm font-black`} style={{ background: 'var(--accent)' }}>
                                            Login ke Server Kamu
                                        </span>
                                    </Link>
                                    <Link to={'/pricing'} css={tw`no-underline`}>
                                        <span css={tw`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-black`} style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}>
                                            Beli Lagi
                                        </span>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>
        </Page>
    );
};
