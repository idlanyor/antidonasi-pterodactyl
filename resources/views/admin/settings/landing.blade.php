@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'landing'])

@section('title')
    Landing Page Settings
@endsection

@section('content-header')
    <h1 style="color:#fff">Landing Page<small style="color:#fff">Edit konten landing page publik.</small></h1>
    <ol class="breadcrumb" style="color:#fff">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.settings') }}">Settings</a></li>
        <li class="active">Landing Page</li>
    </ol>
@endsection

@section('content')
<style>
    .aurora-admin-wrapper {
        position: relative;
        border-radius: 1rem;
        overflow: hidden;
        background: #0b0e14;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.7);
        padding: 2rem;
        margin-bottom: 2rem;
        min-height: 500px;
    }
    .aurora-bg {
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        z-index: 0; pointer-events: none; overflow: hidden;
    }
    .aurora-blob { position: absolute; filter: blur(100px); opacity: 0.6; border-radius: 50%; animation: admin-move 30s infinite alternate ease-in-out; }
    .blob-1 { width: 60%; height: 70%; background: radial-gradient(circle, #c084fc 0%, transparent 70%); top: -20%; left: -15%; }
    .blob-2 { width: 70%; height: 60%; background: radial-gradient(circle, #4facfe 0%, transparent 70%); bottom: -15%; right: -10%; animation-delay: -10s; }
    .blob-3 { width: 50%; height: 50%; background: radial-gradient(circle, #7000ff 0%, transparent 70%); top: 15%; right: 5%; animation-delay: -20s; }
    .blob-4 { width: 45%; height: 45%; background: radial-gradient(circle, #a855f7 0%, transparent 70%); bottom: 10%; left: 10%; animation-delay: -5s; }
    @keyframes admin-move {
        0% { transform: translate(0, 0) scale(1) rotate(0deg); }
        33% { transform: translate(15%, 20%) scale(1.2) rotate(10deg); }
        66% { transform: translate(-10%, 25%) scale(0.8) rotate(-10deg); }
        100% { transform: translate(0, 0) scale(1) rotate(0deg); }
    }
    .aurora-content { position: relative; z-index: 1; }
    .form-control, .select2-container--default .select2-selection--single {
        border-radius: 0.5rem; border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(10, 10, 20, 0.4); color: #fff;
    }
    .form-control:focus { border-color: rgba(168, 85, 247, 0.5); box-shadow: none; }
    .form-group label.control-label { color: #cbd5e1; font-weight: 600; }
    .text-muted small { color: #64748b; }
</style>

    @yield('settings::nav')
    <div class="aurora-admin-wrapper">
        <div class="aurora-bg">
            <div class="aurora-blob blob-1"></div>
            <div class="aurora-blob blob-2"></div>
            <div class="aurora-blob blob-3"></div>
            <div class="aurora-blob blob-4"></div>
        </div>
        <div class="aurora-content">
            <form action="{{ route('admin.settings.landing') }}" method="POST">
                @method('PATCH')
                <div class="row">
                    <div class="col-md-12">
                        <div class="box" style="background: transparent; border: none; box-shadow: none;">
                            <div class="box-header with-border" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                                <h3 class="box-title" style="font-size: 1.25rem; font-weight: 600;"><i class="fa fa-home" style="color: #818cf8; margin-right: 10px;"></i> Brand &amp; Hero</h3>
                            </div>
                            <div class="box-body" style="padding-top: 20px;">
                                <div class="row">
                                    <div class="form-group col-md-4">
                                        <label class="control-label">Nama Brand</label>
                                        <input type="text" class="form-control" name="landing:brand_name" value="{{ old('landing:brand_name', config('landing.brand_name', config('app.name'))) }}" />
                                        <p class="text-muted"><small>Nama brand di navbar &amp; footer landing.</small></p>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="control-label">Logo URL</label>
                                        <input type="text" class="form-control" name="landing:logo_url" value="{{ old('landing:logo_url', config('landing.logo_url')) }}" placeholder="https://..." />
                                        <p class="text-muted"><small>URL gambar logo (PNG/SVG). Kosongkan untuk teks saja.</small></p>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="control-label">Footer Text</label>
                                        <input type="text" class="form-control" name="landing:footer_text" value="{{ old('landing:footer_text', config('landing.footer_text')) }}" />
                                        <p class="text-muted"><small>Teks copyright di footer.</small></p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-4">
                                        <label class="control-label">Hero Badge</label>
                                        <input type="text" class="form-control" name="landing:hero_badge" value="{{ old('landing:hero_badge', config('landing.hero_badge')) }}" />
                                        <p class="text-muted"><small>Pill kecil di atas headline, contoh: "Premium Pterodactyl Panel Hosting".</small></p>
                                    </div>
                                    <div class="form-group col-md-8">
                                        <label class="control-label">Hero Headline</label>
                                        <input type="text" class="form-control" name="landing:hero_headline" value="{{ old('landing:hero_headline', config('landing.hero_headline')) }}" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label">Hero Subheadline</label>
                                    <textarea class="form-control" name="landing:hero_subheadline" rows="2">{{ old('landing:hero_subheadline', config('landing.hero_subheadline')) }}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                @php
                    $icons = ['bolt', 'shield', 'rocket', 'globe', 'server', 'database', 'cog', 'shield-alt'];
                @endphp

                <div class="row">
                    @for ($i = 1; $i <= 3; $i++)
                        <div class="col-md-4">
                            <div class="box" style="background: transparent; border: none; box-shadow: none;">
                                <div class="box-header with-border" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                                    <h3 class="box-title" style="font-size: 1.15rem; font-weight: 600;"><i class="fa fa-th-large" style="color: #818cf8; margin-right: 10px;"></i> Feature {{ $i }}</h3>
                                </div>
                                <div class="box-body" style="padding-top: 20px;">
                                    <div class="form-group">
                                        <label class="control-label">Icon</label>
                                        <select class="form-control" name="landing:feature_{{ $i }}_icon">
                                            @foreach ($icons as $icon)
                                                <option value="{{ $icon }}" @if(old('landing:feature_'.$i.'_icon', config('landing.feature_'.$i.'_icon')) == $icon) selected @endif>{{ $icon }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label">Judul</label>
                                        <input type="text" class="form-control" name="landing:feature_{{ $i }}_title" value="{{ old('landing:feature_'.$i.'_title', config('landing.feature_'.$i.'_title')) }}" />
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label">Deskripsi</label>
                                        <textarea class="form-control" name="landing:feature_{{ $i }}_desc" rows="4">{{ old('landing:feature_'.$i.'_desc', config('landing.feature_'.$i.'_desc')) }}</textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endfor
                </div>

                <div class="box-footer" style="background: transparent; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                    {!! csrf_field() !!}
                    <button type="submit" class="btn btn-sm btn-primary pull-right" style="background: linear-gradient(135deg, #a855f7, #3b82f6); border: none; padding: 8px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">Simpan</button>
                </div>
            </form>
        </div>
    </div>
@endsection
