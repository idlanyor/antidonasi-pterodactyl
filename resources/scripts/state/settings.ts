import { action, Action } from 'easy-peasy';

export interface LandingFeature {
    icon: string;
    title: string;
    desc: string;
}

export interface SiteSettings {
    name: string;
    locale: string;
    recaptcha: {
        enabled: boolean;
        siteKey: string;
    };
    landing: {
        brandName: string;
        logoUrl: string;
        heroBadge: string;
        heroHeadline: string;
        heroSubheadline: string;
        features: LandingFeature[];
        footerText: string;
    };
}

export interface SettingsStore {
    data?: SiteSettings;
    setSettings: Action<SettingsStore, SiteSettings>;
}

const settings: SettingsStore = {
    data: undefined,

    setSettings: action((state, payload) => {
        state.data = payload;
    }),
};

export default settings;
