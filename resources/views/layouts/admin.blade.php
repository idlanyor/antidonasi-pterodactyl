<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{{ config('app.name', 'Pterodactyl') }} - @yield('title')</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="_token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#0e4688">

        <script>
            // Apply the user's accent color (shared with the React client area) before
            // the admin CSS paints, avoiding a flash of the wrong color. Default violet.
            (function () {
                function hexToRgb(h) {
                    h = h.replace('#', '');
                    if (h.length === 3) {
                        h = h.split('').map(function (c) { return c + c; }).join('');
                    }
                    var n = parseInt(h, 16);
                    return ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255);
                }

                var root = document.documentElement;
                var accent = '#7C3AED';
                try {
                    var stored = localStorage.getItem('pterodactyl:accent');
                    if (stored && /^#[0-9a-fA-F]{6}$/.test(stored)) {
                        accent = stored;
                    }
                } catch (e) { /* localStorage unavailable */ }
                root.style.setProperty('--accent', accent);
                root.style.setProperty('--accent-rgb', hexToRgb(accent));
            })();
        </script>

        @include('layouts.scripts')

        @section('scripts')
            {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/admin.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/colors/skin-blue.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
            {!! Theme::css('css/pterodactyl.css?t={cache-version}') !!}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">

            <style>
                /* Glassmorph cards for admin boxes */
                .content-wrapper .box {
                    background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.12), rgba(59, 130, 246, 0.12));
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                    color: #fff;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
                }
                .content-wrapper .box .box-header {
                    background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.18), rgba(59, 130, 246, 0.18));
                    border-bottom-color: rgba(255, 255, 255, 0.12) !important;
                    color: #fff;
                }
                .content-wrapper .box .box-title,
                .content-wrapper .box .box-body,
                .content-wrapper .box .box-footer,
                .content-wrapper .box .box-body p,
                .content-wrapper .box .box-body li,
                .content-wrapper .box .box-body a,
                .content-wrapper .box code,
                .content-wrapper .box pre {
                    color: #fff;
                }
                .content-wrapper .box code {
                    background: rgba(0, 0, 0, 0.35);
                    border-radius: 4px;
                    padding: 2px 6px;
                }
                /* Buttons: ensure white text for contrast */
                .content-wrapper .btn { color: #fff; }
                /* Optional subtle glass look for neutral buttons */
                .content-wrapper .btn-default,
                .content-wrapper .btn-primary,
                .content-wrapper .btn-success,
                .content-wrapper .btn-warning,
                .content-wrapper .btn-danger {
                    border-color: rgba(255, 255, 255, 0.18);
                }
                .content-wrapper .btn-default {
                    background-image: linear-gradient(135deg, rgba(59,130,246,0.25), rgba(var(--accent-rgb),0.20));
                    background-color: rgba(255,255,255,0.06);
                }
                .content-wrapper .btn-default:hover {
                    border-color: rgba(255, 255, 255, 0.28);
                }

                /* Sidebar: Modern Glassmorph + Purple/Blue */
                .main-sidebar {
                    background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.15), rgba(59, 130, 246, 0.15));
                    -webkit-backdrop-filter: blur(16px);
                    backdrop-filter: blur(16px);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    box-shadow: 2px 0 10px rgba(0,0,0,0.2);
                }
                .main-sidebar .sidebar {
                    color: #fff;
                    padding: 15px 10px;
                }
                .main-sidebar .sidebar a { color: #fff; }
                .main-sidebar .sidebar-menu > li {
                    margin-bottom: 6px;
                }
                .main-sidebar .sidebar-menu > li > a {
                    color: #e5e7eb !important;
                    background: transparent !important;
                    transition: all 250ms ease;
                    position: relative;
                    border-radius: 0.75rem;
                    padding: 10px 15px;
                    display: flex;
                    align-items: center;
                }
                .main-sidebar .sidebar-menu > li.header {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    padding: 15px 15px 10px 15px;
                    font-weight: 700;
                    background: transparent !important;
                }
                .main-sidebar .sidebar-menu > li > a:hover {
                    background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.25), rgba(59, 130, 246, 0.15)) !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    transform: translateX(4px);
                    color: #fff !important;
                }
                .main-sidebar .sidebar-menu > li.active > a {
                    background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.4), rgba(59, 130, 246, 0.3)) !important;
                    box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.2);
                    font-weight: 600;
                    color: #fff !important;
                }
                .main-sidebar .sidebar-menu > li > a:focus {
                    background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.25), rgba(59, 130, 246, 0.15)) !important;
                }
                /* Left accent bar on active */
                .main-sidebar .sidebar-menu > li.active > a::before {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 15%;
                    bottom: 15%;
                    width: 4px;
                    background: linear-gradient(180deg, #a855f7, #3b82f6);
                    border-radius: 0 4px 4px 0;
                    box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.8);
                }
                /* Icons inside sidebar */
                .main-sidebar .sidebar-menu > li > a > i,
                .main-sidebar .sidebar-menu > li > a .fa {
                    color: #d1d5db !important;
                    width: 32px;
                    height: 32px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.05);
                    border-radius: 8px;
                    margin-right: 12px;
                    transition: all 250ms ease;
                    font-size: 14px;
                }
                .main-sidebar .sidebar-menu > li.active > a > i,
                .main-sidebar .sidebar-menu > li:hover > a > i {
                    background: rgba(255,255,255,0.15);
                    color: #fff !important;
                    box-shadow: 0 2px 8px rgba(var(--accent-rgb), 0.4);
                }
                /* Treeview submenu */
                .main-sidebar .treeview-menu {
                    background: transparent !important;
                }
                .main-sidebar .treeview-menu > li > a {
                    color: rgba(255, 255, 255, 0.9) !important;
                }
                .main-sidebar .treeview-menu > li.active > a,
                .main-sidebar .treeview-menu > li > a:hover {
                    color: #fff !important;
                }
                /* Sidebar scrollbar (webkit) */
                .main-sidebar .sidebar::-webkit-scrollbar { width: 8px; }
                .main-sidebar .sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 6px; }
                .main-sidebar .sidebar::-webkit-scrollbar-track { background: transparent; }

                /* Header / Navbar: glassmorph + white text */
                .main-header,
                .main-header .navbar {
                    background: linear-gradient(180deg, rgba(var(--accent-rgb),0.16), rgba(59,130,246,0.16));
                    -webkit-backdrop-filter: blur(12px);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255,255,255,0.12);
                    color: #fff;
                }
                .main-header { box-shadow: 0 4px 18px rgba(0,0,0,0.22); }
                .main-header .logo {
                    background: transparent !important;
                    color: #fff !important;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.25);
                }
                .main-header .navbar .nav > li > a,
                .main-header .navbar .navbar-custom-menu > .nav > li > a { color: #fff !important; }
                .main-header .sidebar-toggle .icon-bar { background-color: #fff !important; }
                .main-header .navbar a:hover,
                .main-header .navbar a:focus {
                    background: linear-gradient(90deg, rgba(59,130,246,0.22), rgba(var(--accent-rgb),0.18)) !important;
                    color: #fff !important;
                }

                /* Breadcrumb & content header */
                .content-header > h1,
                .content-header > h1 small { color: #fff; }
                .content-header .breadcrumb { background: transparent; }
                .content-header .breadcrumb > li > a { color: rgba(255,255,255,0.9); }
                .content-header .breadcrumb > li > a:hover { color: #fff; text-decoration: underline; }
                .content-header .breadcrumb > li.active { color: #fff; }

                /* Content links default to light for contrast */
                .content-wrapper a { color: #e6faff; }
                .content-wrapper a:hover { color: #c7f9ff; }

                /* Smooth collapse/expand transitions */
                .main-sidebar,
                .content-wrapper,
                .main-header .logo { transition: all 200ms ease; }

                /* Forms: inputs, selects (Bootstrap + Select2) */
                .content-wrapper .form-control {
                    background: linear-gradient(135deg, rgba(59,130,246,0.10), rgba(var(--accent-rgb),0.08));
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.18);
                    -webkit-backdrop-filter: blur(8px);
                    backdrop-filter: blur(8px);
                }
                .content-wrapper .form-control::placeholder { color: rgba(255,255,255,0.75); }
                .content-wrapper .form-control:focus {
                    border-color: rgba(255,255,255,0.35);
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.35);
                }
                .content-wrapper .input-group-addon {
                    background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(var(--accent-rgb),0.10));
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.18);
                }
                /* Native <select> options (Bootstrap) — dark dropdown list */
                .content-wrapper select.form-control {
                    background-color: #0b0e14;
                    background-image: none;
                    color: #fff;
                }
                .content-wrapper select.form-control option,
                .content-wrapper select.form-control optgroup {
                    background-color: #0f172a;
                    color: #fff;
                }

                /* Select2 adjustments */
                .select2-container .select2-selection--single,
                .select2-container .select2-selection--multiple {
                    background: linear-gradient(135deg, rgba(59,130,246,0.10), rgba(var(--accent-rgb),0.08));
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.18);
                    -webkit-backdrop-filter: blur(8px);
                    backdrop-filter: blur(8px);
                }
                .select2-container .select2-selection__rendered { color: #fff !important; }
                .select2-container .select2-selection__placeholder { color: rgba(255,255,255,0.75) !important; }
                .select2-container .select2-selection__choice { color: #fff; background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.25); }
                .select2-dropdown { background: rgba(12,18,28,0.85); color: #fff; border: 1px solid rgba(255,255,255,0.18); }
                .select2-results__option--highlighted { background: rgba(59,130,246,0.35) !important; }

                /* Tables: glass rows and white headings */
                .content-wrapper .table { color: #fff; }
                .content-wrapper .table > thead > tr > th {
                    background: linear-gradient(135deg, rgba(var(--accent-rgb),0.18), rgba(59,130,246,0.18));
                    color: #fff;
                    border-bottom: 1px solid rgba(255,255,255,0.15);
                }
                .content-wrapper .table > tbody > tr {
                    background: rgba(255,255,255,0.06);
                    transition: background 160ms ease;
                }
                .content-wrapper .table > tbody > tr:hover {
                    background: linear-gradient(90deg, rgba(59,130,246,0.16), rgba(var(--accent-rgb),0.12));
                }
                .content-wrapper .table > tbody > tr > td { border-top: 1px solid rgba(255,255,255,0.12); }
                .content-wrapper .table code { color: #fff; background: rgba(0,0,0,0.35); border-radius: 4px; padding: 2px 6px; }

                /* Alerts: ensure text contrast */
                .content-wrapper .alert { color: #fff; }
                .content-wrapper .alert-danger { background: rgba(239,68,68,0.35); border-color: rgba(239,68,68,0.55); }
                .content-wrapper .alert-success { background: rgba(var(--accent-rgb),0.30); border-color: rgba(var(--accent-rgb),0.55); }
                .content-wrapper .alert-info { background: rgba(14,165,233,0.30); border-color: rgba(14,165,233,0.55); }
                .content-wrapper .alert-warning { background: rgba(245,158,11,0.30); border-color: rgba(245,158,11,0.55); }

                /* Pagination: glass buttons */
                .content-wrapper .pagination > li > a,
                .content-wrapper .pagination > li > span {
                    background: linear-gradient(135deg, rgba(59,130,246,0.18), rgba(var(--accent-rgb),0.14));
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.18);
                }
                .content-wrapper .pagination > li > a:hover {
                    border-color: rgba(255,255,255,0.28);
                    background: linear-gradient(135deg, rgba(59,130,246,0.24), rgba(var(--accent-rgb),0.18));
                }
                .content-wrapper .pagination > .active > a,
                .content-wrapper .pagination > .active > span {
                    background: linear-gradient(135deg, rgba(59,130,246,0.30), rgba(var(--accent-rgb),0.26));
                    border-color: rgba(255,255,255,0.35);
                }
                /* Admin background to solid black */
                body,
                .wrapper,
                .content-wrapper,
                .right-side,
                .content,
                .main-footer {
                    background-color: #000 !important;
                }
                .main-footer {
                    color: #fff;
                    border-top: 1px solid rgba(255,255,255,0.12);
                }
                /* Topbar/Navbar: solid black background */
                .main-header,
                .main-header .navbar {
                    background-color: #000 !important;
                    -webkit-backdrop-filter: none;
                    backdrop-filter: none;
                    border-bottom: 1px solid rgba(255,255,255,0.12);
                    color: #fff;
                }
                .main-header .navbar a:hover,
                .main-header .navbar a:focus {
                    background-color: rgba(255,255,255,0.06) !important;
                    color: #fff !important;
                }
            </style>

            <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
            <![endif]-->
        @show
    </head>
    <body class="hold-transition skin-blue fixed sidebar-mini">
        <div class="wrapper">
            <header class="main-header">
                <a href="{{ route('index') }}" class="logo">
                    <span>{{ config('app.name', 'Pterodactyl') }}</span>
                </a>
                <nav class="navbar navbar-static-top">
                    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <li class="user-menu">
                                <a href="{{ route('account') }}">
                                    <img src="https://www.gravatar.com/avatar/{{ md5(strtolower(Auth::user()->email)) }}?s=160" class="user-image" alt="User Image">
                                    <span class="hidden-xs">{{ Auth::user()->name_first }} {{ Auth::user()->name_last }}</span>
                                </a>
                            </li>
                            <li>
                                <li><a href="{{ route('index') }}" data-toggle="tooltip" data-placement="bottom" title="Exit Admin Control"><i class="fa fa-server"></i></a></li>
                            </li>
                            <li>
                                <li><a href="{{ route('auth.logout') }}" id="logoutButton" data-toggle="tooltip" data-placement="bottom" title="Logout"><i class="fa fa-sign-out"></i></a></li>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <aside class="main-sidebar">
                <section class="sidebar">
                    <ul class="sidebar-menu">
                        <li class="header">BASIC ADMINISTRATION</li>
                        <li class="{{ Route::currentRouteName() !== 'admin.index' ?: 'active' }}">
                            <a href="{{ route('admin.index') }}">
                                <i class="fa fa-home"></i> <span>Overview</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.settings') ?: 'active' }}">
                            <a href="{{ route('admin.settings')}}">
                                <i class="fa fa-wrench"></i> <span>Settings</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.api') ?: 'active' }}">
                            <a href="{{ route('admin.api.index')}}">
                                <i class="fa fa-gamepad"></i> <span>Application API</span>
                            </a>
                        </li>
                        <li class="header">MANAGEMENT</li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.databases') ?: 'active' }}">
                            <a href="{{ route('admin.databases') }}">
                                <i class="fa fa-database"></i> <span>Databases</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.locations') ?: 'active' }}">
                            <a href="{{ route('admin.locations') }}">
                                <i class="fa fa-globe"></i> <span>Locations</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nodes') ?: 'active' }}">
                            <a href="{{ route('admin.nodes') }}">
                                <i class="fa fa-sitemap"></i> <span>Nodes</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.servers') ?: 'active' }}">
                            <a href="{{ route('admin.servers') }}">
                                <i class="fa fa-server"></i> <span>Servers</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.users') ?: 'active' }}">
                            <a href="{{ route('admin.users') }}">
                                <i class="fa fa-users"></i> <span>Users</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.store') ?: 'active' }}">
                            <a href="{{ route('admin.store.index') }}">
                                <i class="fa fa-shopping-cart"></i> <span>Store</span>
                            </a>
                        </li>
                        <li class="header">SERVICE MANAGEMENT</li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.mounts') ?: 'active' }}">
                            <a href="{{ route('admin.mounts') }}">
                                <i class="fa fa-magic"></i> <span>Mounts</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nests') ?: 'active' }}">
                            <a href="{{ route('admin.nests') }}">
                                <i class="fa fa-th-large"></i> <span>Nests</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
            <div class="content-wrapper">
                <section class="content-header">
                    @yield('content-header')
                </section>
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            @if (count($errors) > 0)
                                <div class="alert alert-danger">
                                    There was an error validating the data provided.<br><br>
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                            @foreach (Alert::getMessages() as $type => $messages)
                                @foreach ($messages as $message)
                                    <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                        {!! $message !!}
                                    </div>
                                @endforeach
                            @endforeach
                        </div>
                    </div>
                    @yield('content')
                </section>
            </div>
            <footer class="main-footer">
                <div class="pull-right small text-gray" style="margin-right:10px;margin-top:-7px;">
                    <strong><i class="fa fa-fw {{ $appIsGit ? 'fa-git-square' : 'fa-code-fork' }}"></i></strong> {{ $appVersion }}<br />
                    <strong><i class="fa fa-fw fa-clock-o"></i></strong> {{ round(microtime(true) - LARAVEL_START, 3) }}s
                </div>
                Copyright &copy; 2015 - {{ date('Y') }} <a href="https://pterodactyl.io/">Pterodactyl Software</a>.
            </footer>
        </div>
        @section('footer-scripts')
            <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
            <script>keyboardeventKeyPolyfill.polyfill();</script>

            {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
            {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
            <script src="/js/autocomplete.js" type="application/javascript"></script>

            @if(Auth::user()->root_admin)
                <script>
                    $('#logoutButton').on('click', function (event) {
                        event.preventDefault();

                        var that = this;
                        swal({
                            title: 'Do you want to log out?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d9534f',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Log out'
                        }, function () {
                             $.ajax({
                                type: 'POST',
                                url: '{{ route('auth.logout') }}',
                                data: {
                                    _token: '{{ csrf_token() }}'
                                },complete: function () {
                                    window.location.href = '{{route('auth.login')}}';
                                }
                        });
                    });
                });
                </script>
            @endif

            <script>
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                })
            </script>
        @show
    </body>
</html>
