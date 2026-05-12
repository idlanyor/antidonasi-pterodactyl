@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'basic'])

@section('title')
    Settings
@endsection

@section('content-header')
    <h1 style="color:#fff">Panel Settings<small style="color:#fff">Configure Pterodactyl to your liking.</small></h1>
    <ol class="breadcrumb" style="color:#fff">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Settings</li>
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
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
    }

    .aurora-blob {
        position: absolute;
        filter: blur(100px);
        opacity: 0.6;
        border-radius: 50%;
        animation: admin-move 30s infinite alternate ease-in-out;
    }

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

    .aurora-content {
        position: relative;
        z-index: 1;
    }

    .nav-tabs-floating {
        background: rgba(17, 24, 39, 0.6);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 1rem;
        padding: 5px;
        margin-bottom: 20px;
    }
    
    .nav-tabs-custom > .nav-tabs {
        border-bottom-color: transparent;
    }
    
    .nav-tabs-custom > .nav-tabs > li {
        margin-bottom: 0;
    }
    
    .nav-tabs-custom > .nav-tabs > li > a {
        color: #9ca3af;
        border: none !important;
        border-radius: 0.75rem;
        padding: 10px 20px;
        font-weight: 600;
        transition: all 0.2s ease;
    }
    
    .nav-tabs-custom > .nav-tabs > li > a:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
    }
    
    .nav-tabs-custom > .nav-tabs > li.active > a {
        background: linear-gradient(135deg, rgba(59,130,246,0.30), rgba(168, 85, 247,0.26)) !important;
        color: #fff !important;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .form-control, .select2-container--default .select2-selection--single {
        border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(10, 10, 20, 0.4);
        color: #fff;
    }

    .btn-group .btn {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(10, 10, 20, 0.4);
        color: #9ca3af;
    }

    .btn-group .btn.active {
        background: linear-gradient(135deg, rgba(59,130,246,0.30), rgba(168, 85, 247,0.26));
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
    }
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
            <div class="row">
                <div class="col-xs-12">
                    <div class="box" style="background: transparent; border: none; box-shadow: none;">
                        <div class="box-header with-border" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                            <h3 class="box-title" style="font-size: 1.5rem; font-weight: 600;"><i class="fa fa-cogs" style="color: #818cf8; margin-right: 10px;"></i> General Settings</h3>
                        </div>
                        <form action="{{ route('admin.settings') }}" method="POST">
                            <div class="box-body" style="padding-top: 20px;">
                                <div class="row">
                                    <div class="form-group col-md-4">
                                        <label class="control-label">Company Name</label>
                                        <div>
                                            <input type="text" class="form-control" name="app:name" value="{{ old('app:name', config('app.name')) }}" />
                                            <p class="text-muted"><small>This is the name that is used throughout the panel and in emails sent to clients.</small></p>
                                        </div>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="control-label">Require 2-Factor Authentication</label>
                                        <div>
                                            <div class="btn-group" data-toggle="buttons">
                                                @php
                                                    $level = old('pterodactyl:auth:2fa_required', config('pterodactyl.auth.2fa_required'));
                                                @endphp
                                                <label class="btn btn-primary @if ($level == 0) active @endif">
                                                    <input type="radio" name="pterodactyl:auth:2fa_required" autocomplete="off" value="0" @if ($level == 0) checked @endif> Not Required
                                                </label>
                                                <label class="btn btn-primary @if ($level == 1) active @endif">
                                                    <input type="radio" name="pterodactyl:auth:2fa_required" autocomplete="off" value="1" @if ($level == 1) checked @endif> Admin Only
                                                </label>
                                                <label class="btn btn-primary @if ($level == 2) active @endif">
                                                    <input type="radio" name="pterodactyl:auth:2fa_required" autocomplete="off" value="2" @if ($level == 2) checked @endif> All Users
                                                </label>
                                            </div>
                                            <p class="text-muted"><small>If enabled, any account falling into the selected grouping will be required to have 2-Factor authentication enabled to use the Panel.</small></p>
                                        </div>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="control-label">Default Language</label>
                                        <div>
                                            <select name="app:locale" class="form-control">
                                                @foreach($languages as $key => $value)
                                                    <option value="{{ $key }}" @if(config('app.locale') === $key) selected @endif>{{ $value }}</option>
                                                @endforeach
                                            </select>
                                            <p class="text-muted"><small>The default language to use when rendering UI components.</small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="box-footer" style="background: transparent; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                                {!! csrf_field() !!}
                                <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right" style="background: linear-gradient(135deg, #a855f7, #3b82f6); border: none; padding: 8px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">Save Settings</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
