<?php

/*
|--------------------------------------------------------------------------
| Landing Page Content
|--------------------------------------------------------------------------
|
| Default content for the public landing page. These values are overridden
| by database settings (settings::landing:*) when set via the admin panel.
|
*/

return [
    'brand_name' => env('LANDING_BRAND_NAME'),
    'logo_url' => env('LANDING_LOGO_URL', ''),
    'hero_badge' => env('LANDING_HERO_BADGE', ''),
    'hero_headline' => env('LANDING_HERO_HEADLINE', ''),
    'hero_subheadline' => env('LANDING_HERO_SUBHEADLINE', ''),
    'feature_1_icon' => 'bolt',
    'feature_1_title' => '',
    'feature_1_desc' => '',
    'feature_2_icon' => 'shield',
    'feature_2_title' => '',
    'feature_2_desc' => '',
    'feature_3_icon' => 'rocket',
    'feature_3_title' => '',
    'feature_3_desc' => '',
    'footer_text' => env('LANDING_FOOTER_TEXT', ''),
];
