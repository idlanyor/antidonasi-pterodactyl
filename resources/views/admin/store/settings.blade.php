@extends('layouts.admin')

@section('title')
    Store Settings
@endsection

@section('content-header')
    <h1>Store Settings<small>Konfigurasi payment gateway Bayarcash.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.store.index') }}">Store</a></li>
        <li class="active">Settings</li>
    </ol>
@endsection

@section('content')
    <form action="{{ route('admin.store.settings') }}" method="POST">
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Bayarcash Payment Gateway</h3>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <label class="control-label">Gateway Aktif</label>
                            <select name="store_gateway" class="form-control">
                                @foreach($gateways as $gateway)
                                    <option value="{{ $gateway }}" @if(old('store_gateway', $settings['store_gateway']) == $gateway) selected @endif>{{ ucfirst($gateway) }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label">API Token</label>
                            <input type="text" name="bayarcash_api_token" class="form-control" value="{{ old('bayarcash_api_token', $settings['bayarcash_api_token']) }}" />
                            <p class="text-muted"><small>Dari dashboard Bayarcash console.</small></p>
                        </div>
                        <div class="form-group">
                            <label class="control-label">API Secret Key</label>
                            <input type="password" name="bayarcash_api_secret" class="form-control" value="{{ old('bayarcash_api_secret', $settings['bayarcash_api_secret']) }}" />
                            <p class="text-muted"><small>Digunakan untuk checksum & verifikasi callback.</small></p>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Portal Key</label>
                            <input type="text" name="bayarcash_portal_key" class="form-control" value="{{ old('bayarcash_portal_key', $settings['bayarcash_portal_key']) }}" />
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="control-label">Environment</label>
                                    <select name="bayarcash_sandbox" class="form-control">
                                        <option value="1" @if(old('bayarcash_sandbox', $settings['bayarcash_sandbox']) == '1') selected @endif>Sandbox (Test)</option>
                                        <option value="0" @if(old('bayarcash_sandbox', $settings['bayarcash_sandbox']) == '0') selected @endif>Production (Live)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="control-label">Payment Channel</label>
                                    <input type="text" name="bayarcash_payment_channel" class="form-control" value="{{ old('bayarcash_payment_channel', $settings['bayarcash_payment_channel']) }}" />
                                    <p class="text-muted"><small>ID channel, contoh <code>1</code> = FPX. Pisahkan koma untuk banyak channel.</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">No. Telepon Payer (default)</label>
                            <input type="text" name="bayarcash_payer_telephone" class="form-control" value="{{ old('bayarcash_payer_telephone', $settings['bayarcash_payer_telephone']) }}" />
                            <p class="text-muted"><small>Wajib untuk channel e-wallet/DuitNow/QRIS. Bisa dikosongkan.</small></p>
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <button type="submit" class="btn btn-primary pull-right">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection
