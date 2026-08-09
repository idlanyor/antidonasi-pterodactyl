import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faShieldAlt, faRocket, faGlobe, faServer, faDatabase, faCog, faMemory, faMicrochip, faHdd, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { LandingFeature } from '@/state/settings';
import useSWR from 'swr';
import { StoreProduct } from '@/api/store';
import http from '@/api/http';

const Page = styled.div`
    ${tw`min-h-screen font-sans`};
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
`;

const Navigation = styled.nav`
    ${tw`w-full z-50 sticky top-0 border-b`};
    background-color: var(--nav-bg);
    border-color: var(--border-primary);
    box-shadow: var(--nav-shadow);
    transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const NavInner = styled.div`
    ${tw`max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between`};
`;

const Logo = styled.div`
    ${tw`text-lg md:text-xl font-black tracking-tight flex items-center gap-2.5`};
    font-family: 'Raleway', sans-serif;
    color: var(--text-primary);

    img {
        ${tw`w-8 h-8 rounded-lg shadow-sm`};
    }
`;

const NavLinks = styled.div`
    ${tw`hidden md:flex items-center gap-6`};

    a {
        ${tw`text-sm font-bold hover:text-accent-purple transition-colors duration-300`};
        color: var(--text-secondary);
    }
`;

const ActionButtons = styled.div`
    ${tw`flex items-center gap-3`};
`;

const PrimaryButton = styled(Link)`
    ${tw`inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-black text-sm uppercase tracking-widest transition-all duration-300`};
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent) 100%);
    box-shadow: 0 14px 30px 0 rgba(var(--accent-rgb), 0.24);

    &:hover {
        opacity: 0.9;
        box-shadow: 0 18px 36px 0 rgba(var(--accent-rgb), 0.32);
        transform: translateY(-2px);
    }
`;

const SecondaryButton = styled(Link)`
    ${tw`inline-flex items-center justify-center px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 border`};
    background-color: var(--bg-tertiary);
    color: var(--text-secondary);
    border-color: var(--border-primary);

    &:hover {
        background-color: var(--bg-hover);
        color: var(--text-primary);
        border-color: var(--border-secondary);
    }
`;

const HeroSection = styled.section`
    ${tw`relative pt-20 pb-14 lg:pt-28 lg:pb-20 overflow-hidden`};
    background-color: var(--bg-primary);

    &::before {
        content: '';
        ${tw`absolute inset-0 pointer-events-none`};
        background: radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 100% 50%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
    }
`;

const HeroInner = styled.div`
    ${tw`max-w-[1280px] mx-auto px-6 relative z-10 text-center`};
`;

const Headline = styled.h1`
    ${tw`text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4 max-w-4xl mx-auto`};
    font-family: 'Raleway', sans-serif;
    color: var(--text-primary);
`;

const Subheadline = styled.p`
    ${tw`text-base md:text-xl font-bold mb-8 max-w-2xl mx-auto leading-relaxed`};
    color: var(--text-secondary);
`;

const FeaturesSection = styled.section`
    ${tw`py-14 border-t`};
    background-color: var(--bg-secondary);
    border-color: var(--border-primary);
    transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const FeaturesInner = styled.div`
    ${tw`max-w-[1280px] mx-auto px-6`};
`;

const Grid = styled.div`
    ${tw`grid grid-cols-1 md:grid-cols-3 gap-6`};
`;

const FeatureCard = styled.div`
    ${tw`rounded-2xl p-6 border transition-all duration-300`};
    background-color: var(--bg-elevated);
    border-color: var(--border-primary);

    &:hover {
        border-color: var(--border-secondary);
        box-shadow: var(--shadow-xl);
        transform: translateY(-5px);
    }
`;

const FeatureIcon = styled.div`
    ${tw`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 bg-accent-10 text-accent-purple border border-accent-20`};
`;

const PricingSection = styled.section`
    ${tw`py-14`};
    background-color: var(--bg-primary);
    transition: background-color 0.3s ease;
`;

const PricingCard = styled.div`
    ${tw`p-6 rounded-2xl border flex flex-col`};
    background-color: var(--bg-elevated);
    border-color: var(--border-primary);
    box-shadow: var(--shadow-lg);
    transition: all 0.3s ease-in-out;

    &:hover {
        border-color: var(--border-secondary);
        box-shadow: var(--shadow-lg-hover);
        transform: translateY(-2px);
    }
`;

const PriceTag = styled.div`
    ${tw`text-2xl font-black tracking-tight`};
    color: var(--accent);
    font-family: 'Raleway', sans-serif;
`;

const SpecTag = styled.span`
    ${tw`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold`};
    background-color: var(--info-card-bg);
    border: 1px solid var(--info-card-border);
    color: var(--text-secondary);
`;

const FEATURE_ICONS: Record<string, IconDefinition> = {
    bolt: faBolt,
    shield: faShieldAlt,
    'shield-alt': faShieldAlt,
    rocket: faRocket,
    globe: faGlobe,
    server: faServer,
    database: faDatabase,
    cog: faCog,
};

// Default landing content — used when settings are empty so the page never breaks.
const DEFAULT_LANDING = {
    brandName: 'Pterodactyl',
    logoUrl: '',
    heroBadge: 'Premium Pterodactyl Panel Hosting',
    heroHeadline: 'Deploy and manage your servers in seconds.',
    heroSubheadline:
        'Experience ultra-low latency, instant deployment, and powerful hardware designed for the ultimate server management experience.',
    features: [
        {
            icon: 'bolt',
            title: 'Ultra-Fast NVMe SSDs',
            desc: 'Your servers run on enterprise-grade NVMe drives ensuring lightning-fast load times and world saves.',
        },
        {
            icon: 'shield',
            title: 'DDoS Protection',
            desc: 'Advanced 480Gbps DDoS mitigation keeps your server online and your community playing without interruption.',
        },
        {
            icon: 'rocket',
            title: 'Instant Setup',
            desc: 'No waiting. Your server is automatically deployed and ready to play within seconds of your purchase.',
        },
    ] as LandingFeature[],
    footerText: 'Pterodactyl Creative. All rights reserved.',
};

const LandingPage = () => {
    const isAuthenticated = useStoreState((state) => !!state.user.data?.uuid);
    const landing = useStoreState((state) => state.settings.data?.landing || DEFAULT_LANDING);
    const { data: products } = useSWR<StoreProduct[]>('/api/store/public/products', () =>
        http.get('/api/store/public/products').then(({ data }) => data.data)
    );

    const formatPrice = (sen: number): string => 'RM ' + (sen / 100).toFixed(2);

    const features = (landing.features.length ? landing.features : DEFAULT_LANDING.features).map((feature, index) => ({
        ...DEFAULT_LANDING.features[index],
        ...feature,
    }));

    return (
        <Page>
            <Navigation>
                <NavInner>
                    <Logo>
                        {landing.logoUrl && <img src={landing.logoUrl} alt={'Logo'} />}
                        {landing.brandName || DEFAULT_LANDING.brandName}
                    </Logo>
                    <NavLinks>
                        <Link to={'/'}>Home</Link>
                        <Link to={'/pricing'}>Pricing</Link>
                        <a href={'https://wa.me/62895395590009'} target={'_blank'} rel={'noreferrer'}>
                            Contact
                        </a>
                    </NavLinks>
                    <ActionButtons>
                        {isAuthenticated ? (
                            <PrimaryButton to={'/dashboard'}>Go to Dashboard</PrimaryButton>
                        ) : (
                            <>
                                <SecondaryButton to={'/auth/login'} css={tw`inline-flex`}>
                                    Sign In
                                </SecondaryButton>
                                <PrimaryButton to={'/auth/register'} css={tw`hidden sm:inline-flex`}>
                                    Get Started
                                </PrimaryButton>
                            </>
                        )}
                    </ActionButtons>
                </NavInner>
            </Navigation>

            <HeroSection>
                <HeroInner>
                    {(landing.heroBadge || DEFAULT_LANDING.heroBadge) && (
                        <span
                            css={tw`inline-block py-1 px-3.5 rounded-full bg-accent-10 text-accent-purple font-black text-[10px] uppercase tracking-widest mb-4 border border-accent-20`}
                        >
                            {landing.heroBadge || DEFAULT_LANDING.heroBadge}
                        </span>
                    )}
                    <Headline>{landing.heroHeadline || DEFAULT_LANDING.heroHeadline}</Headline>
                    <Subheadline>{landing.heroSubheadline || DEFAULT_LANDING.heroSubheadline}</Subheadline>
                    <div css={tw`flex flex-col sm:flex-row items-center justify-center gap-3`}>
                        <PrimaryButton
                            to={isAuthenticated ? '/dashboard' : '/auth/register'}
                            css={tw`w-full sm:w-auto px-6 py-2.5 text-sm`}
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
                        </PrimaryButton>
                        {!isAuthenticated && (
                            <SecondaryButton to={'/auth/login'} css={tw`w-full sm:w-auto px-6 py-2.5 text-sm`}>
                                Sign In
                            </SecondaryButton>
                        )}
                        <SecondaryButton to={'/pricing'} css={tw`w-full sm:w-auto px-6 py-2.5 text-sm`}>
                            View Pricing
                        </SecondaryButton>
                    </div>
                </HeroInner>
            </HeroSection>

            <FeaturesSection>
                <FeaturesInner>
                    <div css={tw`text-center mb-10`}>
                        <h2 css={tw`text-2xl md:text-3xl font-black tracking-tight mb-2`} style={{ color: 'var(--text-primary)' }}>
                            Why Choose Us?
                        </h2>
                        <p css={tw`text-base font-bold`} style={{ color: 'var(--text-secondary)' }}>
                            Built for performance, designed for simplicity.
                        </p>
                    </div>
                    <Grid>
                        {features.map((feature, index) => (
                            <FeatureCard key={index}>
                                <FeatureIcon>
                                    <FontAwesomeIcon icon={FEATURE_ICONS[feature.icon] || faBolt} />
                                </FeatureIcon>
                                <h3
                                    css={tw`text-lg font-black mb-2 tracking-tight`}
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {feature.title}
                                </h3>
                                <p css={tw`font-bold leading-relaxed`} style={{ color: 'var(--text-secondary)' }}>
                                    {feature.desc}
                                </p>
                            </FeatureCard>
                        ))}
                    </Grid>
                </FeaturesInner>
            </FeaturesSection>

            {products && products.length > 0 && (
                <PricingSection>
                    <div css={tw`max-w-[1280px] mx-auto px-6`}>
                        <div css={tw`text-center mb-10`}>
                            <h2 css={tw`text-2xl md:text-3xl font-black tracking-tight mb-2`} style={{ color: 'var(--text-primary)' }}>
                                Paket Server
                            </h2>
                            <p css={tw`text-base font-bold`} style={{ color: 'var(--text-secondary)' }}>
                                Pilih paket, bayar, langsung jalan.
                            </p>
                        </div>
                        <div css={tw`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                            {products.map((product) => (
                                <PricingCard key={product.id}>
                                    <div css={tw`flex items-start justify-between gap-3`}>
                                        <h3 css={tw`text-lg font-black tracking-tight truncate`} style={{ color: 'var(--text-primary)' }}>
                                            {product.name}
                                        </h3>
                                        <PriceTag>{formatPrice(product.price)}</PriceTag>
                                    </div>
                                    <div css={tw`mt-4 flex flex-wrap gap-2`}>
                                        <SpecTag>
                                            <FontAwesomeIcon icon={faMemory} size={'sm'} /> {product.memory} MB
                                        </SpecTag>
                                        <SpecTag>
                                            <FontAwesomeIcon icon={faMicrochip} size={'sm'} /> {product.cpu}%
                                        </SpecTag>
                                        <SpecTag>
                                            <FontAwesomeIcon icon={faHdd} size={'sm'} /> {Math.round(product.disk / 1024)} GB
                                        </SpecTag>
                                    </div>
                                    <PrimaryButton
                                        to={`/checkout/${product.id}`}
                                        css={tw`mt-5 w-full justify-center py-2.5 text-sm`}
                                    >
                                        Beli Sekarang
                                    </PrimaryButton>
                                </PricingCard>
                            ))}
                        </div>
                    </div>
                </PricingSection>
            )}

            <footer
                css={tw`py-12 border-t`}
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                }}
            >
                <div css={tw`max-w-[1280px] mx-auto px-6 text-center`}>
                    <p css={tw`font-bold opacity-50`} style={{ color: 'var(--text-primary)' }}>
                        &copy; {new Date().getFullYear()} {landing.footerText || DEFAULT_LANDING.footerText}
                    </p>
                </div>
            </footer>
        </Page>
    );
};

export default LandingPage;
