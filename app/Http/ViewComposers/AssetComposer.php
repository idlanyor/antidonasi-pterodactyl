<?php

namespace Pterodactyl\Http\ViewComposers;

use Illuminate\View\View;
use Pterodactyl\Services\Helpers\AssetHashService;

class AssetComposer
{
    /**
     * AssetComposer constructor.
     */
    public function __construct(private AssetHashService $assetHashService)
    {
    }

    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view): void
    {
        $view->with('asset', $this->assetHashService);
        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'Pterodactyl',
            'locale' => config('app.locale') ?? 'en',
            'recaptcha' => [
                'enabled' => config('recaptcha.enabled', false),
                'siteKey' => config('recaptcha.website_key') ?? '',
            ],
            'landing' => [
                'brandName' => config('landing.brand_name') ?: (config('app.name') ?: 'Pterodactyl'),
                'logoUrl' => config('landing.logo_url') ?? '',
                'heroBadge' => config('landing.hero_badge') ?? '',
                'heroHeadline' => config('landing.hero_headline') ?? '',
                'heroSubheadline' => config('landing.hero_subheadline') ?? '',
                'features' => [
                    [
                        'icon' => config('landing.feature_1_icon') ?? 'bolt',
                        'title' => config('landing.feature_1_title') ?? '',
                        'desc' => config('landing.feature_1_desc') ?? '',
                    ],
                    [
                        'icon' => config('landing.feature_2_icon') ?? 'shield',
                        'title' => config('landing.feature_2_title') ?? '',
                        'desc' => config('landing.feature_2_desc') ?? '',
                    ],
                    [
                        'icon' => config('landing.feature_3_icon') ?? 'rocket',
                        'title' => config('landing.feature_3_title') ?? '',
                        'desc' => config('landing.feature_3_desc') ?? '',
                    ],
                ],
                'footerText' => config('landing.footer_text') ?? '',
            ],
        ]);
    }
}
