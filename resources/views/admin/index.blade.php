@extends('layouts.admin')

@section('title')
    Administration
@endsection

@section('content-header')
    <h1 style="color:#fff">Administrative Overview<small style="color:#fff">A quick glance at your system.</small></h1>
    <ol class="breadcrumb" style="color:#fff">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Index</li>
    </ol>
@endsection

@section('content')
<style>
    /* Aurora Background for Admin Index */
    .aurora-admin-wrapper {
        position: relative;
        border-radius: 1rem;
        overflow: hidden;
        background: #0b0e14;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.7);
        padding: 2rem;
        margin-bottom: 2rem;
        min-height: 400px;
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

    /* Admin CSS Grid */
    .admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
    }

    .glass-card {
        background: rgba(17, 24, 39, 0.6);
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 1rem;
        padding: 1.5rem;
        color: #fff;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        text-decoration: none !important;
    }

    .glass-card:hover {
        background: rgba(17, 24, 39, 0.8);
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateY(-4px);
        box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.3);
        color: #fff;
    }

    .glass-card i {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #818cf8;
    }

    .glass-card h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .glass-card p {
        margin: 0;
        color: #9ca3af;
        font-size: 0.875rem;
    }

    .system-info-box {
        background: rgba(17, 24, 39, 0.6);
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 1rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }
    .system-info-box h3 { margin-top: 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 15px; }
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .status-up-to-date { background: rgba(168, 85, 247, 0.1); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.2); }
    .status-outdated { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
    
</style>

<div class="aurora-admin-wrapper">
    <div class="aurora-bg">
        <div class="aurora-blob blob-1"></div>
        <div class="aurora-blob blob-2"></div>
        <div class="aurora-blob blob-3"></div>
        <div class="aurora-blob blob-4"></div>
    </div>

    <div class="aurora-content">
        <div class="system-info-box">
            <h3><i class="fa fa-server" style="color: #818cf8; margin-right: 10px;"></i> System Information</h3>
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <div>
                    @if ($version->isLatestPanel())
                        <span class="status-badge status-up-to-date"><i class="fa fa-check-circle"></i> System Up To Date</span>
                        <p style="margin-top: 10px; color: #d1d5db;">You are running Pterodactyl Panel version <code style="background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px;">{{ config('app.version') }}</code>.</p>
                    @else
                        <span class="status-badge status-outdated"><i class="fa fa-exclamation-triangle"></i> Update Available</span>
                        <p style="margin-top: 10px; color: #d1d5db;">The latest version is <a href="https://github.com/Pterodactyl/Panel/releases/v{{ $version->getPanel() }}" target="_blank" style="color: #60a5fa;"><code>{{ $version->getPanel() }}</code></a>. You are currently running <code style="background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px;">{{ config('app.version') }}</code>.</p>
                    @endif
                </div>
                <div>
                     <a href="https://pterodactyl.io/panel/1.0/updating.html" target="_blank" class="btn btn-primary" style="background: linear-gradient(135deg, rgba(59,130,246,0.25), rgba(168, 85, 247,0.20)); border: 1px solid rgba(255,255,255,0.18); border-radius: 8px; padding: 8px 16px;"><i class="fa fa-download"></i> View Update Guide</a>
                </div>
            </div>
        </div>

        <div class="admin-grid">
            <a href="{{ $version->getDiscord() }}" target="_blank" class="glass-card">
                <i class="fa fa-comments-o"></i>
                <h3>Get Help</h3>
                <p>Join our Discord community for support and discussions.</p>
            </a>
            
            <a href="https://pterodactyl.io" target="_blank" class="glass-card">
                <i class="fa fa-book"></i>
                <h3>Documentation</h3>
                <p>Read the official documentation to configure your panel.</p>
            </a>

            <a href="https://github.com/pterodactyl/panel" target="_blank" class="glass-card">
                <i class="fa fa-github"></i>
                <h3>GitHub</h3>
                <p>View the source code, report bugs, or contribute.</p>
            </a>

            <a href="{{ $version->getDonations() }}" target="_blank" class="glass-card">
                <i class="fa fa-heart"></i>
                <h3>Support Us</h3>
                <p>Help keep the project alive by making a donation.</p>
            </a>
        </div>
    </div>
</div>
@endsection

