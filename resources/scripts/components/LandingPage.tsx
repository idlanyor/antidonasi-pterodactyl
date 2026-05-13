import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faShieldAlt, faRocket } from '@fortawesome/free-solid-svg-icons';

const Page = styled.div`
    ${tw`min-h-screen bg-neutral-50 text-brand-navy font-sans`};
    background-color: #f8fafc;
`;

const Navigation = styled.nav`
    ${tw`w-full bg-white border-b border-neutral-200 z-50 sticky top-0`};
    box-shadow: 0 -10px 30px 0 rgba(15, 23, 42, 0.08);
`;

const NavInner = styled.div`
    ${tw`max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between`};
`;

const Logo = styled.div`
    ${tw`text-2xl font-black text-brand-navy tracking-tight flex items-center gap-3`};
    font-family: 'Satoshi', sans-serif;

    img {
        ${tw`w-10 h-10 rounded-xl shadow-sm`};
    }
`;

const NavLinks = styled.div`
    ${tw`hidden md:flex items-center gap-8`};

    a {
        ${tw`text-base font-bold text-brand-slate hover:text-accent-purple transition-colors duration-300`};
    }
`;

const ActionButtons = styled.div`
    ${tw`flex items-center gap-4`};
`;

const PrimaryButton = styled(Link)`
    ${tw`inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-black text-sm uppercase tracking-widest transition-all duration-300`};
    background: linear-gradient(135deg, #ec4899 0%, #7c3aed 100%);
    box-shadow: 0 14px 30px 0 rgba(168, 85, 247, 0.24);

    &:hover {
        opacity: 0.9;
        box-shadow: 0 18px 36px 0 rgba(168, 85, 247, 0.32);
        transform: translateY(-2px);
    }
`;

const SecondaryButton = styled(Link)`
    ${tw`inline-flex items-center justify-center px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300`};
    background-color: #f1f5f9;
    color: #64748b;
    border: 1px solid #e2e8f0;

    &:hover {
        background-color: #e2e8f0;
        color: #0f172a;
    }
`;

const HeroSection = styled.section`
    ${tw`relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden`};
    background-color: #f8fafc;

    &::before {
        content: '';
        ${tw`absolute inset-0 pointer-events-none`};
        background: radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 100% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 50%);
    }
`;

const HeroInner = styled.div`
    ${tw`max-w-[1280px] mx-auto px-6 relative z-10 text-center`};
`;

const Headline = styled.h1`
    ${tw`text-5xl md:text-7xl font-black text-brand-navy tracking-tight leading-tight mb-6 max-w-4xl mx-auto`};
    font-family: 'Satoshi', sans-serif;
`;

const Subheadline = styled.p`
    ${tw`text-lg md:text-2xl text-brand-slate font-bold mb-10 max-w-2xl mx-auto leading-relaxed`};
`;

const FeaturesSection = styled.section`
    ${tw`py-20 bg-white border-t border-neutral-200`};
`;

const FeaturesInner = styled.div`
    ${tw`max-w-[1280px] mx-auto px-6`};
`;

const Grid = styled.div`
    ${tw`grid grid-cols-1 md:grid-cols-3 gap-8`};
`;

const FeatureCard = styled.div`
    ${tw`bg-neutral-50 rounded-2xl p-8 border border-neutral-200 transition-all duration-300`};

    &:hover {
        ${tw`bg-white shadow-xl border-accent-purple`};
        transform: translateY(-5px);
    }
`;

const FeatureIcon = styled.div`
    ${tw`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 bg-accent-purple bg-opacity-10 text-accent-purple border border-accent-purple border-opacity-20`};
`;

const LandingPage = () => {
    const isAuthenticated = useStoreState((state) => !!state.user.data?.uuid);

    return (
        <Page>
            <Navigation>
                <NavInner>
                    <Logo>
                        <img src={'https://s3.ireng.uk/13800c0f064f58af8d97c5ce065c00b4.png'} alt={'Logo'} />
                        Antidonasi
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
                    <span
                        css={tw`inline-block py-1.5 px-4 rounded-full bg-accent-purple bg-opacity-10 text-accent-purple font-black text-[10px] uppercase tracking-widest mb-6 border border-accent-purple border-opacity-20`}
                    >
                        Premium Pterodactyl Panel Hosting
                    </span>
                    <Headline>Deploy and manage your servers in seconds.</Headline>
                    <Subheadline>
                        Experience ultra-low latency, instant deployment, and powerful hardware designed for the
                        ultimate server management experience.
                    </Subheadline>
                    <div css={tw`flex flex-col sm:flex-row items-center justify-center gap-4`}>
                        <PrimaryButton
                            to={isAuthenticated ? '/dashboard' : '/auth/register'}
                            css={tw`w-full sm:w-auto px-10 py-4 text-base`}
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
                        </PrimaryButton>
                        {!isAuthenticated && (
                            <SecondaryButton to={'/auth/login'} css={tw`w-full sm:w-auto px-10 py-4 text-base`}>
                                Sign In
                            </SecondaryButton>
                        )}
                        <SecondaryButton to={'/pricing'} css={tw`w-full sm:w-auto px-10 py-4 text-base`}>
                            View Pricing
                        </SecondaryButton>
                    </div>
                </HeroInner>
            </HeroSection>

            <FeaturesSection>
                <FeaturesInner>
                    <div css={tw`text-center mb-16`}>
                        <h2 css={tw`text-4xl font-black text-brand-navy tracking-tight mb-4`}>Why Choose Us?</h2>
                        <p css={tw`text-lg text-brand-slate font-bold`}>
                            Built for performance, designed for simplicity.
                        </p>
                    </div>
                    <Grid>
                        <FeatureCard>
                            <FeatureIcon>
                                <FontAwesomeIcon icon={faBolt} />
                            </FeatureIcon>
                            <h3 css={tw`text-xl font-black text-brand-navy mb-3 tracking-tight`}>
                                Ultra-Fast NVMe SSDs
                            </h3>
                            <p css={tw`text-brand-slate font-bold leading-relaxed`}>
                                Your servers run on enterprise-grade NVMe drives ensuring lightning-fast load times and
                                world saves.
                            </p>
                        </FeatureCard>
                        <FeatureCard>
                            <FeatureIcon>
                                <FontAwesomeIcon icon={faShieldAlt} />
                            </FeatureIcon>
                            <h3 css={tw`text-xl font-black text-brand-navy mb-3 tracking-tight`}>DDoS Protection</h3>
                            <p css={tw`text-brand-slate font-bold leading-relaxed`}>
                                Advanced 480Gbps DDoS mitigation keeps your server online and your community playing
                                without interruption.
                            </p>
                        </FeatureCard>
                        <FeatureCard>
                            <FeatureIcon>
                                <FontAwesomeIcon icon={faRocket} />
                            </FeatureIcon>
                            <h3 css={tw`text-xl font-black text-brand-navy mb-3 tracking-tight`}>Instant Setup</h3>
                            <p css={tw`text-brand-slate font-bold leading-relaxed`}>
                                No waiting. Your server is automatically deployed and ready to play within seconds of
                                your purchase.
                            </p>
                        </FeatureCard>
                    </Grid>
                </FeaturesInner>
            </FeaturesSection>

            <footer css={tw`bg-brand-navy text-white py-12`}>
                <div css={tw`max-w-[1280px] mx-auto px-6 text-center`}>
                    <p css={tw`font-bold opacity-50`}>
                        &copy; {new Date().getFullYear()} Antidonasi Creative. All rights reserved.
                    </p>
                </div>
            </footer>
        </Page>
    );
};

export default LandingPage;
