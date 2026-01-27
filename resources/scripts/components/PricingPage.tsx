import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Page = styled.div`
    ${tw`min-h-screen bg-neutral-900 text-neutral-100`};
`;

const Container = styled.div`
    ${tw`max-w-5xl mx-auto px-6 py-10`};
`;

const Card = styled.div`
    ${tw`bg-neutral-900 border border-neutral-800 rounded-xl p-6`};
`;

const Table = styled.div`
    ${tw`grid grid-cols-1 md:grid-cols-2 gap-4`};
`;

const Row = styled.div`
    ${tw`flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-900`};
`;

const Badge = styled.span`
    ${tw`text-xs font-semibold uppercase tracking-wider text-neutral-400`};
`;

export default () => (
    <Page>
        <Container>
            <div css={tw`mb-6`}>
                <h1 css={tw`text-2xl font-semibold`}>Pricelist Panel Pterodactyl / bulan</h1>
                <p css={tw`text-sm text-neutral-400 mt-1`}>Paket panel dengan resource tetap dan harga bulanan.</p>
            </div>

            <Card>
                <Table>
                    <Row>
                        <Badge>100%</Badge>
                        <span css={tw`text-sm`}>2 GB RAM · 3 GB Storage</span>
                        <span css={tw`text-sm font-semibold`}>10.000</span>
                    </Row>
                    <Row>
                        <Badge>200%</Badge>
                        <span css={tw`text-sm`}>4 GB RAM · 5 GB Storage</span>
                        <span css={tw`text-sm font-semibold`}>15.000</span>
                    </Row>
                    <Row>
                        <Badge>300%</Badge>
                        <span css={tw`text-sm`}>6 GB RAM · 7 GB Storage</span>
                        <span css={tw`text-sm font-semibold`}>20.000</span>
                    </Row>
                    <Row>
                        <Badge>400%</Badge>
                        <span css={tw`text-sm`}>8 GB RAM · 10 GB Storage</span>
                        <span css={tw`text-sm font-semibold`}>25.000</span>
                    </Row>
                    <Row>
                        <Badge>500%</Badge>
                        <span css={tw`text-sm`}>12 GB RAM · 12 GB Storage</span>
                        <span css={tw`text-sm font-semibold`}>30.000</span>
                    </Row>
                    <Row>
                        <Badge>600%</Badge>
                        <span css={tw`text-sm`}>13 GB RAM · 20 GB Storage</span>
                        <span css={tw`text-sm font-semibold`}>35.000</span>
                    </Row>
                    <Row>
                        <Badge>700%</Badge>
                        <span css={tw`text-sm`}>15 GB RAM · 25 GB Storage</span>
                        <span css={tw`text-sm font-semibold`}>50.000</span>
                    </Row>
                </Table>
            </Card>

            <div css={tw`mt-6 grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <Card>
                    <h2 css={tw`text-lg font-semibold mb-3`}>Benefit</h2>
                    <ul css={tw`text-sm text-neutral-300 space-y-2`}>
                        <li>• Bisa diperpanjang</li>
                        <li>• Garansi 30Day</li>
                        <li>• Portspeed 1.5-10 GB/s</li>
                        <li>• Processor AMD Epyc Milan 7C13 &amp; Intel Haswell no TSX</li>
                    </ul>
                </Card>
                <Card>
                    <h2 css={tw`text-lg font-semibold mb-3`}>Ketentuan</h2>
                    <p css={tw`text-sm text-neutral-300`}>
                        Dilarang untuk aktivitas Illegal seperti DDOS, Mining, Run Tool Exploit, dll.
                    </p>
                    <div css={tw`mt-4`}>
                        <a
                            href={'https://wa.me/62895395590009'}
                            target={'_blank'}
                            rel={'noreferrer'}
                            css={tw`inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500`}
                        >
                            Hubungi Atemin
                        </a>
                    </div>
                </Card>
            </div>
        </Container>
    </Page>
);
