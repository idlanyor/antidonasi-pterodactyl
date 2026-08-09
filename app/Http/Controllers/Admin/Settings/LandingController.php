<?php

namespace Pterodactyl\Http\Controllers\Admin\Settings;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Contracts\Console\Kernel;
use Pterodactyl\Http\Controllers\Controller;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;

class LandingController extends Controller
{
    /**
     * LandingController constructor.
     */
    public function __construct(
        private ConfigRepository $config,
        private Kernel $kernel,
        private SettingsRepositoryInterface $settings,
    ) {
    }

    /**
     * Render UI for editing landing page content.
     */
    public function index(): View
    {
        return view('admin.settings.landing');
    }

    /**
     * Handle request to update landing page content.
     */
    public function update(Request $request): Response
    {
        $keys = [
            'landing:brand_name',
            'landing:logo_url',
            'landing:hero_badge',
            'landing:hero_headline',
            'landing:hero_subheadline',
            'landing:feature_1_icon',
            'landing:feature_1_title',
            'landing:feature_1_desc',
            'landing:feature_2_icon',
            'landing:feature_2_title',
            'landing:feature_2_desc',
            'landing:feature_3_icon',
            'landing:feature_3_title',
            'landing:feature_3_desc',
            'landing:footer_text',
        ];

        foreach ($keys as $key) {
            $this->settings->set('settings::' . $key, $request->input($key, ''));
        }

        $this->kernel->call('queue:restart');

        return response('', 204);
    }
}
