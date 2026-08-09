import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMemory,
    faMicrochip,
    faHdd,
    faDatabase,
    faCopy,
    faArchive,
    faArrowLeft,
    faArrowRight,
    faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import useSWR from 'swr';
import { getStoreProducts, getPublicChannels, checkoutStoreProductGuest, PaymentChannel, StoreProduct } from '@/api/store';

const formatPrice = (sen: number): string => 'RM ' + (sen / 100).toFixed(2);

const Page = styled.div`
    ${tw`min-h-screen font-sans`};
    background-color: var(--bg-primary);
    color: var(--text-primary);
`;

const Navigation = styled.nav`
    ${tw`w-full z-50 sticky top-0 border-b`};
    background-color: var(--nav-bg);
    border-color: var(--border-primary);
    box-shadow: var(--nav-shadow);
`;

const NavInner = styled.div`
    ${tw`max-w-3xl mx-auto px-6 h-16 flex items-center justify-between`};
`;

const NavLogo = styled(Link)`
    ${tw`text-lg md:text-xl font-black tracking-tight`};
    font-family: 'Raleway', sans-serif;
    color: var(--text-primary);
`;

const Container = styled.div`
    ${tw`max-w-3xl mx-auto px-6 py-10`};
`;

const Title = styled.div`
    ${tw`relative mb-6 p-6 md:p-8 rounded-2xl overflow-hidden`};
    background: var(--gradient-hero);
    border: 1px solid var(--gradient-hero-border);
    box-shadow: var(--shadow-lg);

    h1 {
        ${tw`text-2xl md:text-3xl font-black tracking-tight leading-tight`};
        color: var(--text-primary);
        font-family: 'Raleway', sans-serif;
    }

    p {
        ${tw`mt-2 text-sm md:text-base font-bold leading-relaxed`};
        color: var(--text-secondary);
    }
`;

const Section = styled.div`
    ${tw`p-5 md:p-6 rounded-2xl border mb-4`};
    background: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);
`;

const SectionTitle = styled.h2`
    ${tw`text-sm font-black uppercase tracking-widest mb-4`};
    color: var(--text-primary);
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

const ChannelButton = styled.button`
    ${tw`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left text-sm font-bold transition-all duration-300 cursor-pointer`};
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    border-color: var(--border-primary);

    &:hover {
        border-color: var(--accent);
    }

    &[aria-pressed='true'] {
        background-color: rgba(var(--accent-rgb), 0.1);
        border-color: var(--accent);
    }
`;

const Price = styled.div`
    ${tw`text-2xl font-black tracking-tight`};
    color: var(--accent);
    font-family: 'Raleway', sans-serif;
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
    const { id } = useParams<{ id: string }>();
    const productId = Number(id);
    const { data: product } = useSWR<StoreProduct>(['store-public-product', productId], () =>
        getStoreProducts().then((products) => {
            const found = products.find((p) => p.id === productId);
            if (!found) throw new Error('Product not found');
            return found;
        })
    );
    const { data: channels, error: channelsError } = useSWR<PaymentChannel[]>('/api/store/public/channels', () => getPublicChannels());

    const [channel, setChannel] = useState<string>('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (channels && channels.length && !channel) {
            setChannel(channels[0].id);
        }
    }, [channels]);

    const confirm = () => {
        if (!product) return;
        setError(null);
        setLoading(true);
        checkoutStoreProductGuest({ product_id: product.id, channel, name, email, telephone })
            .then((result) => {
                window.location.href = result.payment_url;
            })
            .catch((err) => {
                setError(err.response?.data?.error || err.message || 'Terjadi kesalahan.');
                setLoading(false);
            });
    };

    return (
        <Page>
            <Navigation>
                <NavInner>
                    <NavLogo to={'/'}>Checkout</NavLogo>
                    <Link to={'/'} css={tw`text-sm font-bold no-underline`} style={{ color: 'var(--text-secondary)' }}>
                        Kembali
                    </Link>
                </NavInner>
            </Navigation>

            <Container>
                {!product ? (
                    <EmptyState>
                        <h2>Produk tidak ditemukan</h2>
                        <p>Pilih paket dari halaman pricing.</p>
                        <Link to={'/pricing'} css={tw`mt-4`}>
                            <Button>Lihat Pricing</Button>
                        </Link>
                    </EmptyState>
                ) : (
                    <>
                        <Title>
                            <h1>Checkout</h1>
                            <p>Review pesananmu, lalu lanjut ke pembayaran.</p>
                        </Title>

                        <Section>
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
                        </Section>

                        <Section>
                            <SectionTitle>Pilih Metode Pembayaran</SectionTitle>
                            {channelsError ? (
                                <p css={tw`text-sm font-bold`} style={{ color: 'var(--status-error-text)' }}>
                                    Gagal memuat metode pembayaran.
                                </p>
                            ) : !channels ? (
                                <Spinner centered />
                            ) : (
                                <div css={tw`space-y-2.5`}>
                                    {channels.map((c) => (
                                        <ChannelButton
                                            key={c.id}
                                            type={'button'}
                                            aria-pressed={channel === c.id}
                                            onClick={() => setChannel(c.id)}
                                        >
                                            <span css={tw`text-base`}>{c.logo === 'qris' ? '🇮🇩' : c.logo === 'fpx' ? '🇲🇾' : '💠'}</span>
                                            {c.name}
                                        </ChannelButton>
                                    ))}
                                </div>
                            )}
                        </Section>

                        <Section>
                            <SectionTitle>Data Pembeli</SectionTitle>
                            <div css={tw`space-y-4`}>
                                <div>
                                    <Label htmlFor={'checkout-name'}>Nama Lengkap</Label>
                                    <Input
                                        id={'checkout-name'}
                                        type={'text'}
                                        value={name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                        placeholder={'Nama kamu'}
                                    />
                                    <p className={'input-help'} css={tw`mt-1.5 text-xs font-bold`}>
                                        Nama untuk akun & server kamu.
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor={'checkout-email'}>Email</Label>
                                    <Input
                                        id={'checkout-email'}
                                        type={'email'}
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        placeholder={'nama@email.com'}
                                    />
                                    <p className={'input-help'} css={tw`mt-1.5 text-xs font-bold`}>
                                        Login akun + notifikasi pembayaran.
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor={'checkout-telephone'}>Nomor Telepon (opsional)</Label>
                                    <Input
                                        id={'checkout-telephone'}
                                        type={'tel'}
                                        value={telephone}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelephone(e.target.value)}
                                        placeholder={'628xxxxxxx'}
                                    />
                                    <p className={'input-help'} css={tw`mt-1.5 text-xs font-bold`}>
                                        Penerima kode pembayaran.
                                    </p>
                                </div>
                            </div>
                        </Section>

                        {error && (
                            <p css={tw`px-4 py-3 rounded-xl text-sm font-bold mb-4`} style={{ color: 'var(--status-error-text)', backgroundColor: 'var(--status-error-bg)', border: '1px solid var(--status-error-border)' }}>
                                {error}
                            </p>
                        )}

                        <div css={tw`flex items-center justify-between gap-3`}>
                            <Link to={'/pricing'} css={tw`no-underline`}>
                                <Button type={'button'} size={'large'} css={tw`!bg-transparent`}>
                                    <FontAwesomeIcon icon={faArrowLeft} size={'sm'} css={tw`mr-2`} />
                                    Kembali
                                </Button>
                            </Link>
                            <Button size={'large'} disabled={loading || !channels || channels.length === 0} onClick={confirm}>
                                {loading ? (
                                    <Spinner size={'small'} />
                                ) : (
                                    <>
                                        Bayar {formatPrice(product.price)}
                                        <FontAwesomeIcon icon={faArrowRight} size={'sm'} css={tw`ml-2`} />
                                    </>
                                )}
                            </Button>
                        </div>
                        <p css={tw`mt-4 flex items-center justify-center gap-2 text-xs font-bold`} style={{ color: 'var(--text-muted)' }}>
                            <FontAwesomeIcon icon={faLock} size={'sm'} />
                            Pembayaran diproses aman oleh Bayarcash.
                        </p>
                    </>
                )}
            </Container>
        </Page>
    );
};
